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
  message_preview?: string;
  inquiry_id?: string;
  dashboard_tab?: string;
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

// Build channel candidates for robust delivery (ID, raw name, #name)
function buildChannelCandidates(channelInput: string): string[] {
  const trimmed = (channelInput || "").trim();

  // Channel ID (preferred)
  if (/^C[A-Z0-9]+$/.test(trimmed)) {
    return [trimmed];
  }

  const base = trimmed.replace(/^#/, "");
  const candidates = [trimmed, base, `#${base}`]
    .map((c) => c.trim())
    .filter(Boolean);

  // Unique preserve order
  return [...new Set(candidates)];
}

async function sendSlackMessage(channel: string, blocks: any[], text: string) {
  const response = await fetch(`${GATEWAY_URL}/chat.postMessage`, {
    method: "POST",
    headers: { ...getHeaders(), "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({ channel, blocks, text, username: "WEBHEADS Bot", icon_emoji: ":globe_with_meridians:" }),
  });

  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(`Slack API error [${response.status}]: ${JSON.stringify(data)}`);
  }
  return data;
}

async function listConversationsPage(cursor?: string) {
  const response = await fetch(`${GATEWAY_URL}/conversations.list`, {
    method: "POST",
    headers: { ...getHeaders(), "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      types: "public_channel,private_channel",
      exclude_archived: true,
      limit: 200,
      cursor,
    }),
  });

  const data = await response.json();
  if (!response.ok || !data.ok) {
    throw new Error(`Slack API error [${response.status}]: ${JSON.stringify(data)}`);
  }

  return data;
}

async function resolveChannelId(channelInput: string): Promise<string | null> {
  if (/^C[A-Z0-9]+$/.test(channelInput)) return channelInput;

  const targetName = channelInput.replace(/^#/, "").toLowerCase();
  let cursor: string | undefined;

  for (let i = 0; i < 10; i += 1) {
    const data = await listConversationsPage(cursor);

    const match = (data.channels || []).find((ch: { id?: string; name?: string }) =>
      (ch.name || "").toLowerCase() === targetName
    );

    if (match?.id) return match.id;

    const nextCursor = data.response_metadata?.next_cursor;
    if (!nextCursor) break;
    cursor = nextCursor;
  }

  return null;
}

async function findFallbackWritableChannelId(): Promise<string | null> {
  let cursor: string | undefined;

  for (let i = 0; i < 10; i += 1) {
    const data = await listConversationsPage(cursor);

    const writable = (data.channels || []).find((ch: { id?: string; is_member?: boolean }) =>
      !!ch.id && ch.is_member === true
    );

    if (writable?.id) return writable.id;

    const nextCursor = data.response_metadata?.next_cursor;
    if (!nextCursor) break;
    cursor = nextCursor;
  }

  return null;
}


const DASHBOARD_URL = "https://webheads-service.lovable.app/admin";

function buildBlocks(notification: SlackNotification) {
  const emoji = notification.type === "new_inquiry" ? "📬"
    : notification.type === "service_request" ? "🔧"
    : notification.type === "site_error" ? "🚨"
    : "📢";

  const urgencyBar = notification.urgency === "high" ? "🔴 *긴급*  " : "";

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

  // Message preview block
  if (notification.message_preview) {
    const preview = notification.message_preview.length > 300
      ? notification.message_preview.slice(0, 300) + "…"
      : notification.message_preview;
    blocks.push(
      { type: "divider" },
      {
        type: "section",
        text: { type: "mrkdwn", text: `💬 *문의 내용 미리보기:*\n>${preview.replace(/\n/g, "\n>")}` },
      }
    );
  }

  // Action buttons
  const tab = notification.dashboard_tab || (notification.type === "new_inquiry" ? "inquiries" : notification.type === "service_request" ? "service-requests" : "");
  const dashboardLink = tab ? `${DASHBOARD_URL}?tab=${tab}` : DASHBOARD_URL;

  const actions: any[] = [
    {
      type: "button",
      text: { type: "plain_text", text: "📋 대시보드 열기", emoji: true },
      url: dashboardLink,
      style: "primary",
    },
  ];

  blocks.push(
    { type: "divider" },
    { type: "actions", elements: actions }
  );

  const now = new Date().toLocaleString("ko-KR", { timeZone: "Asia/Seoul" });
  blocks.push({
    type: "context",
    elements: [{ type: "mrkdwn", text: `${urgencyBar}⏰ ${now}` }],
  });

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

    const blocks = buildBlocks(notification);
    const fallbackText = `${notification.title}`;

    let resolvedChannelId: string | null = null;
    let fallbackWritableChannelId: string | null = null;

    try {
      resolvedChannelId = await resolveChannelId(channelName);
      if (!resolvedChannelId) {
        fallbackWritableChannelId = await findFallbackWritableChannelId();
      }
    } catch (resolveError) {
      console.warn("Channel resolve failed, fallback to raw channel values:", resolveError);
    }

    const channelCandidates = [
      ...(resolvedChannelId ? [resolvedChannelId] : []),
      ...buildChannelCandidates(channelName),
      ...(fallbackWritableChannelId ? [fallbackWritableChannelId] : []),
    ];

    let delivered = false;
    let lastError: unknown = null;

    for (const channel of [...new Set(channelCandidates)]) {
      try {
        await sendSlackMessage(channel, blocks, fallbackText);
        delivered = true;
        break;
      } catch (err) {
        lastError = err;
        const errorMessage = err instanceof Error ? err.message : String(err);
        // Retry only on channel resolution issue
        if (!errorMessage.includes("channel_not_found")) throw err;
      }
    }

    if (!delivered) {
      throw new Error(
        `Slack channel not found for "${channelName}". 관리자 설정에서 채널명을 정확히 입력하거나 채널 ID(C...)를 사용해 주세요. Last error: ${lastError instanceof Error ? lastError.message : String(lastError)}`,
      );
    }

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
