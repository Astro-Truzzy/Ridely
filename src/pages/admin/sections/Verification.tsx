import { useState } from "react";
import { ShieldCheck } from "lucide-react";
import {
  reviewRiderVerification,
  type RiderVerificationApplication,
} from "../../../Lib/admin";
import Section from "../components/Section";
import { PanelEmpty } from "../components/PanelState";
import { formatDate } from "../format";

export default function Verification({
  applications,
  onReviewed,
  onAuthError,
}: {
  applications: RiderVerificationApplication[];
  onReviewed: (riderId: string) => void;
  onAuthError: () => void;
}) {
  const [reviewingId, setReviewingId] = useState<string | null>(null);
  const [rejectNotes, setRejectNotes] = useState<Record<string, string>>({});
  const [error, setError] = useState("");

  const handleReview = async (riderId: string, action: "approve" | "reject") => {
    setReviewingId(riderId);
    setError("");
    try {
      await reviewRiderVerification({
        action,
        rider_id: riderId,
        admin_notes: action === "reject" ? rejectNotes[riderId] : undefined,
      });
      onReviewed(riderId);
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") {
        onAuthError();
        return;
      }
      setError(err instanceof Error ? err.message : "Review failed");
    } finally {
      setReviewingId(null);
    }
  };

  return (
    <Section
      title="Rider verification"
      subtitle={`${applications.length} pending application${
        applications.length === 1 ? "" : "s"
      }`}
      icon={<ShieldCheck className="w-5 h-5" />}
    >
      {error && <p className="text-red-400 text-sm">{error}</p>}
      <div className="space-y-4">
        {applications.length === 0 ? (
          <PanelEmpty label="No pending rider applications" />
        ) : (
          applications.map((app) => (
            <div key={app.id} className="glass-card rounded-xl p-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                <div>
                  <p className="text-white font-medium">{app.full_name}</p>
                  <p className="text-sm text-[#a0a0b0]">
                    {app.email}
                    {app.phone ? ` · ${app.phone}` : ""}
                  </p>
                  <p className="text-xs text-[#a0a0b0] mt-1">
                    {app.vehicle_type ?? "Vehicle n/a"}
                    {app.plate_number ? ` · ${app.plate_number}` : ""}
                    {" · "}
                    Updated {formatDate(app.updated_at)}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={reviewingId === app.id}
                    onClick={() => handleReview(app.id, "approve")}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 disabled:opacity-50 transition-colors"
                  >
                    {reviewingId === app.id ? "…" : "Approve"}
                  </button>
                  <button
                    type="button"
                    disabled={reviewingId === app.id}
                    onClick={() => handleReview(app.id, "reject")}
                    className="px-3 py-1.5 rounded-lg text-sm font-medium bg-red-500/20 text-red-300 hover:bg-red-500/30 disabled:opacity-50 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              </div>
              <input
                type="text"
                placeholder="Optional reject notes…"
                value={rejectNotes[app.id] ?? ""}
                onChange={(e) =>
                  setRejectNotes((prev) => ({ ...prev, [app.id]: e.target.value }))
                }
                className="w-full bg-[#1a1a2e] border border-white/[0.08] text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175aff]"
              />
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {app.documents.length === 0 ? (
                  <p className="text-sm text-[#a0a0b0]">No documents uploaded</p>
                ) : (
                  app.documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="rounded-lg border border-white/[0.08] p-3 text-sm"
                    >
                      <p className="text-white font-medium capitalize">
                        {doc.document_type.replace(/_/g, " ")}
                      </p>
                      <p className="text-xs text-[#a0a0b0] truncate mt-0.5">
                        {doc.file_name ?? doc.file_path}
                      </p>
                      {doc.signed_url ? (
                        <a
                          href={doc.signed_url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-block mt-2 text-[#4d7dff] hover:underline text-xs"
                        >
                          View document
                        </a>
                      ) : (
                        <p className="mt-2 text-xs text-[#a0a0b0]">Preview unavailable</p>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </Section>
  );
}
