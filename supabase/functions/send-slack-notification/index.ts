import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const GATEWAY_URL = "https://connector-gateway.lovable.dev/slack/api";

interface SlackNotification {
  type: "new_inquiry" | "service_request" | "site_error" | "custom";
  title: string;
  details?: Record<string, string>;
  urgency?: "normal" | "high";
}

function getHeaders() {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");
  const SLACK_API_KEY = Deno.env.get("SLACK_API_KEY");
  if (!SLACK_API_KEY) throw new Error("SLACK_API_KEY is not configured");
  return {
    "Authorization": `Bearer ${LOVABLE_API_KEY}`,
    "X-Connection-Api-Key": SLACK_API_KEY,
    "Content-Type": "application/json",
  };
}

// Resolve channel name to channel ID using conversations.list
async function resolveChannelId(channelName: string): Promise<string> {
  const name = channelName.replace(/^#/, "").toLowerCase();
  let cursor: string | undefined;

  do {
    const params = new URLSearchParams({ types: "public_channel,private_channel", limit: "200" });
    if (cursor) params.set("cursor", cursor);

    const res = await fetch(`${GATEWAY_URL}/conversations.list?${params}`, {
      method: "GET",
      headers: getHeaders(),
    });
    const data = await res.json();
    if (!data.ok) throw new Error(`conversations.list failed: ${data.error}`);

    for (const ch of data.channels || []) {
      if (ch.name === name) return ch.id;
    }
    cursor = data.response_metadata?.next_cursor;
  } while (cursor);

  throw new Error(`Slack 채널 '#${name}'을 찾을 수 없습니다. 채널명을 확인해주세요.`);
}

async function sendSlackMessage(channelId: string, blocks: any[], text: string) {
  const response = await fetch(`${GATEWAY_URL}/chat.postMessage`, {
    method: "POST",
    headers: getHeaders(),
    body: JSON.stringify({ channel: channelId, blocks, text, username: "WEBHEADS Bot", icon_emoji: ":globe_with_meridians:" }),
  });

  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(`Slack API error [${response.status}]: ${JSON.stringify(data)}`);
  }
  return data;
}

function buildBlocks(notification: SlackNotification) {
  const emoji = notification.type === "new_inquiry" ? "📬"
    : notification.type === "service_request" ? "🔧"
    : notification.type === "site_error" ? "🚨"
    : "📢";

  const blocks: any[] = [
    {
      type: "header",
      text: { type: "plain_text", text: `${emoji} ${notification.title}`, emoji: true },
    },
  ];

  if (notification.details) {
    const fields = Object.entries(notification.details).map(([key, value]) => ({
      type: "mrkdwn",
      text: `*${key}:*\n${value}`,
    }));

    for (let i = 0; i < fields.length; i += 10) {
      blocks.push({ type: "section", fields: fields.slice(i, i + 10) });
    }
  }

  const now = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  blocks.push(
    { type: "divider" },
    {
      type: "context",
      elements: [{ type: "mrkdwn", text: `⏰ ${now} | <https://webheads-service.lovable.app/admin|관리자 대시보드 열기>` }],
    }
  );

  return blocks;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const notification: SlackNotification = await req.json();

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { data: setting } = await supabase
      .from("admin_settings")
      .select("value")
      .eq("key", "slack_notifications")
      .maybeSingle();

    const config = (setting?.value as Record<string, any>) || {};
    const enabled = config.enabled !== false;
    const channelName = config.channel || "general";

    if (!enabled) {
      return new Response(JSON.stringify({ ok: true, skipped: true, reason: "disabled" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const typeEnabled = config[`notify_${notification.type}`] !== false;
    if (!typeEnabled) {
      return new Response(JSON.stringify({ ok: true, skipped: true, reason: `${notification.type} disabled` }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Resolve channel name → ID (supports both "general" and "C1234..." formats)
    let channelId: string;
    if (channelName.startsWith("C") && /^C[A-Z0-9]+$/.test(channelName)) {
      channelId = channelName; // Already a channel ID
    } else {
      channelId = await resolveChannelId(channelName);
    }

    const blocks = buildBlocks(notification);
    const fallbackText = `${notification.title}`;

    await sendSlackMessage(channelId, blocks, fallbackText);

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Slack notification error:", e);
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
