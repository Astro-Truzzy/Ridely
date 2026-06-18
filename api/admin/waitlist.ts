import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getBearerToken, verifyAdminToken } from "../_lib/auth";
import { corsHeaders } from "../_lib/cors";
import { getSupabase } from "../_lib/supabase";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const headers = corsHeaders(req.headers.origin, "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return res
      .status(204)
      .setHeader("Access-Control-Allow-Origin", headers["Access-Control-Allow-Origin"])
      .end();
  }

  Object.entries(headers).forEach(([key, value]) => res.setHeader(key, value));

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!verifyAdminToken(getBearerToken(req))) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const role = typeof req.query.role === "string" ? req.query.role : undefined;
    const search = typeof req.query.search === "string" ? req.query.search.trim() : "";
    const limit = Math.min(parseInt(String(req.query.limit ?? "50"), 10) || 50, 100);
    const offset = parseInt(String(req.query.offset ?? "0"), 10) || 0;

    const supabase = getSupabase();
    let query = supabase
      .from("waitlist_signups")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (role === "customer" || role === "rider") {
      query = query.eq("role", role);
    }

    if (search) {
      query = query.or(
        `name.ilike.%${search}%,email.ilike.%${search}%,city.ilike.%${search}%`,
      );
    }

    const { data, count, error } = await query;

    if (error) {
      console.error("Waitlist fetch error:", error);
      return res.status(500).json({ error: "Failed to load waitlist" });
    }

    return res.status(200).json({ signups: data ?? [], total: count ?? 0 });
  } catch (err) {
    console.error("Admin waitlist error:", err);
    return res.status(500).json({ error: "Failed to load waitlist" });
  }
}
