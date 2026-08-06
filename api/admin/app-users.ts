import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getBearerToken, verifyAdminToken } from "../_lib/auth.js";
import { applyCors, corsHeaders, handleCorsOptions } from "../_lib/cors.js";
import { getSupabase } from "../_lib/supabase.js";
import { callRpc } from "../_lib/appMetrics.js";

interface AdminUsersResult {
  rows: unknown[];
  total: number;
}

/**
 * Paginated list of app users (customers + riders) with wallet balances,
 * backed by the admin_users RPC. Mirrors api/admin/waitlist.ts shape.
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
    const role =
      req.query.role === "customer" || req.query.role === "rider"
        ? req.query.role
        : null;
    const search =
      typeof req.query.search === "string" ? req.query.search.trim() : "";
    const limit = Math.min(
      parseInt(String(req.query.limit ?? "25"), 10) || 25,
      100,
    );
    const offset = parseInt(String(req.query.offset ?? "0"), 10) || 0;

    const supabase = getSupabase();
    const result = await callRpc<AdminUsersResult>(supabase, "admin_users", {
      p_role: role,
      p_search: search || null,
      p_limit: limit,
      p_offset: offset,
    });

    if (!result.available) {
      // Graceful: RPC not applied yet — return empty + flag, not an error.
      return res
        .status(200)
        .json({ available: false, rows: [], total: 0, error: result.error });
    }

    return res.status(200).json({
      available: true,
      rows: result.data?.rows ?? [],
      total: result.data?.total ?? 0,
    });
  } catch (err) {
    console.error("Admin app-users error:", err);
    return res.status(500).json({ error: "Failed to load users" });
  }
}
