import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getBearerToken, verifyAdminToken } from "../_lib/auth.js";
import { applyCors, corsHeaders, handleCorsOptions } from "../_lib/cors.js";
import { getSupabase } from "../_lib/supabase.js";

type ReviewBody = {
  action: "approve" | "reject";
  rider_id: string;
  admin_notes?: string;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const headers = corsHeaders(req.headers.origin, "GET, POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return handleCorsOptions(res, headers);
  }

  applyCors(res, headers);

  if (!verifyAdminToken(getBearerToken(req))) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  const supabase = getSupabase();

  try {
    if (req.method === "GET") {
      const { data: riders, error: ridersError } = await supabase
        .from("riders")
        .select(
          "id, email, full_name, phone, vehicle_type, plate_number, account_verification_status, created_at, updated_at",
        )
        .eq("account_verification_status", "pending")
        .order("updated_at", { ascending: false });

      if (ridersError) {
        console.error("Pending riders fetch error:", ridersError);
        return res.status(500).json({ error: "Failed to load pending riders" });
      }

      const riderIds = (riders ?? []).map((r) => r.id);
      let documents: Array<{
        id: string;
        rider_id: string;
        document_type: string;
        file_path: string;
        file_name: string | null;
        review_status: string;
        admin_notes: string | null;
        created_at: string;
        signed_url?: string | null;
      }> = [];

      if (riderIds.length > 0) {
        const { data: docs, error: docsError } = await supabase
          .from("rider_verification_documents")
          .select(
            "id, rider_id, document_type, file_path, file_name, review_status, admin_notes, created_at",
          )
          .in("rider_id", riderIds)
          .order("created_at", { ascending: true });

        if (docsError) {
          console.error("Verification docs fetch error:", docsError);
          return res
            .status(500)
            .json({ error: "Failed to load verification documents" });
        }

        documents = docs ?? [];

        // Signed URLs for private storage (best-effort per file)
        documents = await Promise.all(
          documents.map(async (doc) => {
            try {
              const { data: signed } = await supabase.storage
                .from("rider-verification-docs")
                .createSignedUrl(doc.file_path, 60 * 30);
              return { ...doc, signed_url: signed?.signedUrl ?? null };
            } catch {
              return { ...doc, signed_url: null };
            }
          }),
        );
      }

      const applications = (riders ?? []).map((rider) => ({
        ...rider,
        documents: documents.filter((d) => d.rider_id === rider.id),
      }));

      return res.status(200).json({
        applications,
        total: applications.length,
      });
    }

    if (req.method === "POST") {
      const body = (req.body ?? {}) as ReviewBody;
      const action = body.action;
      const riderId = typeof body.rider_id === "string" ? body.rider_id.trim() : "";
      const adminNotes =
        typeof body.admin_notes === "string" ? body.admin_notes.trim() : "";

      if (!riderId || (action !== "approve" && action !== "reject")) {
        return res.status(400).json({
          error: 'Body must include rider_id and action "approve" | "reject"',
        });
      }

      const nextStatus = action === "approve" ? "verified" : "rejected";
      const docStatus = action === "approve" ? "approved" : "rejected";

      const { data: rider, error: riderError } = await supabase
        .from("riders")
        .update({
          account_verification_status: nextStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", riderId)
        .eq("account_verification_status", "pending")
        .select("id, account_verification_status")
        .maybeSingle();

      if (riderError) {
        console.error("Rider review update error:", riderError);
        return res.status(500).json({ error: "Failed to update rider" });
      }
      if (!rider) {
        return res.status(404).json({
          error: "Pending rider application not found",
        });
      }

      const docUpdate: Record<string, unknown> = {
        review_status: docStatus,
        updated_at: new Date().toISOString(),
      };
      if (adminNotes) docUpdate.admin_notes = adminNotes;

      const { error: docsError } = await supabase
        .from("rider_verification_documents")
        .update(docUpdate)
        .eq("rider_id", riderId)
        .eq("review_status", "pending");

      if (docsError) {
        console.error("Doc review update error:", docsError);
        return res.status(500).json({
          error: "Rider updated but failed to update documents",
          rider,
        });
      }

      return res.status(200).json({
        success: true,
        rider_id: riderId,
        account_verification_status: nextStatus,
      });
    }

    return res.status(405).json({ error: "Method not allowed" });
  } catch (err) {
    console.error("Admin rider-verifications error:", err);
    return res.status(500).json({ error: "Failed to process request" });
  }
}
