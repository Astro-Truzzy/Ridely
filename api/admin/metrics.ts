import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getBearerToken, verifyAdminToken } from "../_lib/auth.js";
import { applyCors, corsHeaders, handleCorsOptions } from "../_lib/cors.js";
import { getSupabase } from "../_lib/supabase.js";
import { callRpc } from "../_lib/appMetrics.js";

/**
 * Aggregated operational metrics for the admin dashboard. Every metric is
 * computed by a SQL RPC (see supabase/admin-dashboard-setup.sql) and wrapped in
 * an {available, data} envelope so one missing/failing RPC never 500s the page.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const headers = corsHeaders(req.headers.origin, "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return handleCorsOptions(res, headers);
  }

  applyCors(res, headers);

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!verifyAdminToken(getBearerToken(req))) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const supabase = getSupabase();

    const [
      overview,
      earningsDay,
      earningsWeek,
      earningsMonth,
      funnel,
      deliveryHotzones,
      riderHotzones,
      leaderboards,
      activity,
    ] = await Promise.all([
      callRpc(supabase, "admin_overview"),
      callRpc(supabase, "admin_earnings_series", { p_bucket: "day" }),
      callRpc(supabase, "admin_earnings_series", { p_bucket: "week" }),
      callRpc(supabase, "admin_earnings_series", { p_bucket: "month" }),
      callRpc(supabase, "admin_delivery_funnel"),
      callRpc(supabase, "admin_hotzones", { p_kind: "delivery" }),
      callRpc(supabase, "admin_hotzones", { p_kind: "rider" }),
      callRpc(supabase, "admin_leaderboards"),
      callRpc(supabase, "admin_recent_activity"),
    ]);

    return res.status(200).json({
      overview,
      earnings: { day: earningsDay, week: earningsWeek, month: earningsMonth },
      funnel,
      hotzones: { delivery: deliveryHotzones, rider: riderHotzones },
      leaderboards,
      activity,
    });
  } catch (err) {
    console.error("Admin metrics error:", err);
    return res.status(500).json({ error: "Failed to load metrics" });
  }
}
