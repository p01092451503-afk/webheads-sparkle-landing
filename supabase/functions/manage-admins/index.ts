import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  // Verify caller is super_admin
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const token = authHeader.replace("Bearer ", "");
  const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);
  if (authError || !user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Check super_admin role
  const { data: roleData } = await supabaseAdmin
    .from("user_roles")
    .select("role")
    .eq("user_id", user.id)
    .in("role", ["super_admin"])
    .maybeSingle();

  if (!roleData) {
    return new Response(JSON.stringify({ error: "최고관리자 권한이 필요합니다." }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { action, ...params } = await req.json();

  try {
    switch (action) {
      case "list_admins": {
        // Get all users with admin or super_admin roles
        const { data: roles } = await supabaseAdmin
          .from("user_roles")
          .select("user_id, role, created_at")
          .in("role", ["admin", "super_admin"]);

        if (!roles || roles.length === 0) {
          return new Response(JSON.stringify({ admins: [] }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Get user emails from auth
        const admins = [];
        for (const r of roles) {
          const { data: { user: u } } = await supabaseAdmin.auth.admin.getUserById(r.user_id);
          admins.push({
            user_id: r.user_id,
            email: u?.email || "unknown",
            role: r.role,
            created_at: r.created_at,
            last_sign_in: u?.last_sign_in_at || null,
          });
        }

        return new Response(JSON.stringify({ admins }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "create_admin": {
        const { email, password, role } = params;
        if (!email || !password) {
          return new Response(JSON.stringify({ error: "이메일과 비밀번호가 필요합니다." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const adminRole = role === "super_admin" ? "super_admin" : "admin";

        // Create user
        const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
          email,
          password,
          email_confirm: true,
        });

        if (createError) {
          return new Response(JSON.stringify({ error: createError.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Assign role
        await supabaseAdmin.from("user_roles").insert({
          user_id: newUser.user.id,
          role: adminRole,
        });

        return new Response(JSON.stringify({ success: true, user_id: newUser.user.id }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "update_role": {
        const { target_user_id, new_role } = params;
        if (!target_user_id || !new_role) {
          return new Response(JSON.stringify({ error: "사용자 ID와 역할이 필요합니다." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Prevent changing own role
        if (target_user_id === user.id) {
          return new Response(JSON.stringify({ error: "자신의 권한은 변경할 수 없습니다." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        await supabaseAdmin
          .from("user_roles")
          .update({ role: new_role })
          .eq("user_id", target_user_id);

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "delete_admin": {
        const { target_user_id } = params;
        if (!target_user_id) {
          return new Response(JSON.stringify({ error: "사용자 ID가 필요합니다." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (target_user_id === user.id) {
          return new Response(JSON.stringify({ error: "자신의 계정은 삭제할 수 없습니다." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        // Delete role first, then user
        await supabaseAdmin.from("user_roles").delete().eq("user_id", target_user_id);
        await supabaseAdmin.auth.admin.deleteUser(target_user_id);

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      case "reset_password": {
        const { target_user_id, new_password } = params;
        if (!target_user_id || !new_password) {
          return new Response(JSON.stringify({ error: "사용자 ID와 새 비밀번호가 필요합니다." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        if (new_password.length < 6) {
          return new Response(JSON.stringify({ error: "비밀번호는 6자 이상이어야 합니다." }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        const { error: resetError } = await supabaseAdmin.auth.admin.updateUserById(
          target_user_id,
          { password: new_password }
        );

        if (resetError) {
          return new Response(JSON.stringify({ error: resetError.message }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }

        return new Response(JSON.stringify({ success: true }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      default:
        return new Response(JSON.stringify({ error: "Unknown action" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
    }
  } catch (e) {
    const message = e instanceof Error ? e.message : "Unknown error";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
