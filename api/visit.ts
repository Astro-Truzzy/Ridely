import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getSupabase } from "./_lib/supabase.js";
import { applyCors, corsHeaders, handleCorsOptions } from "./_lib/cors.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const headers = corsHeaders(req.headers.origin, "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return handleCorsOptions(res, headers);
  }

  applyCors(res, headers);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { path, referrer, sessionId } = req.body ?? {};

    if (!path || typeof path !== "string" || !sessionId || typeof sessionId !== "string") {
      return res.status(400).json({ error: "path and sessionId are required" });
    }

    const supabase = getSupabase();
    const { error } = await supabase.from("page_visits").insert({
      path: path.slice(0, 500),
      referrer: typeof referrer === "string" ? referrer.slice(0, 500) : null,
      session_id: sessionId.slice(0, 100),
    });

    if (error) {
      console.error("Visit insert error:", error);
      return res.status(500).json({ error: "Failed to record visit" });
    }

    return res.status(201).json({ success: true });
  } catch (err) {
    console.error("Visit API error:", err);
    return res.status(500).json({ error: "Something went wrong" });
  }
}
