import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getBearerToken, verifyAdminToken } from "../_lib/auth.js";
import { applyCors, corsHeaders, handleCorsOptions } from "../_lib/cors.js";
import { getSupabase } from "../_lib/supabase.js";
import { callRpc } from "../_lib/appMetrics.js";

interface AdminUsersResult {
  rows: unknown[];
  total: number;
}

interface AdminDeleteResult {
  deleted: boolean;
  auth_id?: string | null;
  error?: string;
}

/**
 * GET: paginated list of app users (customers + riders) with wallet balances,
 * backed by the admin_users RPC. Mirrors api/admin/waitlist.ts shape.
 * DELETE: removes a user/rider profile (admin_delete_user RPC) and, best-effort,
 * their Supabase auth login so they can no longer sign in.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const headers = corsHeaders(req.headers.origin, "GET, DELETE, OPTIONS");

  if (req.method === "OPTIONS") {
    return handleCorsOptions(res, headers);
  }

  applyCors(res, headers);

  if (req.method !== "GET" && req.method !== "DELETE") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!verifyAdminToken(getBearerToken(req))) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const supabase = getSupabase();

  if (req.method === "DELETE") {
    try {
      const id = typeof req.query.id === "string" ? req.query.id.trim() : "";
      const role =
        req.query.role === "customer" || req.query.role === "rider"
          ? req.query.role
          : "";

      if (!id || !role) {
        return res
          .status(400)
          .json({ error: 'Query must include id and role "customer" | "rider"' });
      }

      // purgeLedger=true also deletes ledger_entries rows (money history is
      // destroyed). Only reachable from the dashboard's explicit purge checkbox.
      const purgeLedger =
        req.query.purgeLedger === "true" || req.query.purgeLedger === "1";
      if (purgeLedger) {
        console.warn(`Admin purge-ledger delete of ${role} ${id}`);
      }

      const result = await callRpc<AdminDeleteResult>(
        supabase,
        "admin_delete_user",
        { p_id: id, p_role: role, p_purge_ledger: purgeLedger },
      );

      if (!result.available) {
        return res.status(500).json({
          error: result.error ?? "Delete is not connected yet",
        });
      }
      if (result.data?.error) {
        // Business-rule refusal (e.g. append-only ledger still references the
        // profile) is a conflict, not a server failure — surface it as 409 so
        // logs and the dashboard toast read correctly.
        const refusal = /ledger|append-only|reversal/i.test(result.data.error);
        return res
          .status(refusal ? 409 : 500)
          .json({ error: result.data.error });
      }
      if (!result.data?.deleted) {
        return res.status(404).json({ error: "User not found" });
      }

      // Best-effort: remove the auth login too. The profile id equals the auth
      // uid in this app; if it doesn't (or was already gone), ignore the error.
      const authId = result.data.auth_id ?? id;
      let authRemoved = false;
      try {
        const { error } = await supabase.auth.admin.deleteUser(authId);
        authRemoved = !error;
      } catch {
        authRemoved = false;
      }

      return res.status(200).json({ success: true, deleted: true, authRemoved });
    } catch (err) {
      console.error("Admin delete-user error:", err);
      return res.status(500).json({ error: "Failed to delete user" });
    }
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
