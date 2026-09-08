import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const cors = { "Content-Type": "application/json", "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
function response(body: unknown, status = 200) { return new Response(JSON.stringify(body), { status, headers: cors }); }

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  if (req.method !== "POST") return response({ error: "METHOD_NOT_ALLOWED" }, 405);
  const auth = req.headers.get("Authorization");
  if (!auth?.startsWith("Bearer ")) return response({ error: "UNAUTHORIZED" }, 401);
  const url = Deno.env.get("SUPABASE_URL");
  const anon = Deno.env.get("SUPABASE_ANON_KEY");
  const service = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
  if (!url || !anon || !service) return response({ error: "SERVER_CONFIG_ERROR" }, 500);
  const userClient = createClient(url, anon, { global: { headers: { Authorization: auth } } });
  const { data: { user }, error: userError } = await userClient.auth.getUser();
  if (userError || !user) return response({ error: "UNAUTHORIZED" }, 401);
  const admin = createClient(url, service);
  const { data: rows, error } = await admin.from("level_completions").select("level_id,wins").eq("user_id", user.id).gt("wins", 0).order("level_id");
  if (error) return response({ error: "PROGRESSION_READ_ERROR" }, 500);
  const completed = new Set((rows ?? []).map((row) => Number(row.level_id)));
  let highestCompleted = 0;
  for (let level = 1; level <= 100; level += 1) {
    if (!completed.has(level)) break;
    highestCompleted = level;
  }
  const currentLevel = Math.min(100, highestCompleted + 1);
  return response({ version: 1, highest_completed: highestCompleted, current_level: currentLevel, completed_levels: [...completed].sort((a, b) => a - b), total_levels: 100 });
});
