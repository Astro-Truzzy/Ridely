import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getBearerToken, verifyAdminToken } from "../_lib/auth.js";
import { applyCors, corsHeaders, handleCorsOptions } from "../_lib/cors.js";
import { getSupabase } from "../_lib/supabase.js";
import { callRpc } from "../_lib/appMetrics.js";

interface AdminWalletsResult {
  available: boolean;
  rows: unknown[];
  total: number;
  sum: number;
}

/**
 * Paginated customer wallet balances (ordered by balance desc) plus the summed
 * float across all matching customers, backed by the admin_wallet_balances RPC.
 * Riders have no wallet, so this is customers only. Same graceful {available}
 * envelope the other admin panels use.
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
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const limit = Math.min(
      parseInt(String(req.query.limit ?? "25"), 10) || 25,
      100,
    );
    const offset = parseInt(String(req.query.offset ?? "0"), 10) || 0;

    const supabase = getSupabase();
    const result = await callRpc<AdminWalletsResult>(
      supabase,
      "admin_wallet_balances",
      { p_search: search || null, p_limit: limit, p_offset: offset },
    );

    if (!result.available || !result.data?.available) {
      // Graceful: RPC not applied / no wallet table — flag it, don't error.
      return res.status(200).json({
        available: false,
        rows: [],
        total: 0,
        sum: 0,
        error: result.available ? undefined : result.error,
      });
    }

    return res.status(200).json({
      available: true,
      rows: result.data.rows ?? [],
      total: result.data.total ?? 0,
      sum: result.data.sum ?? 0,
    });
  } catch (err) {
    console.error("Admin wallets error:", err);
    return res.status(500).json({ error: "Failed to load wallet balances" });
  }
}
