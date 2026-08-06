import { motion } from "framer-motion";
import type { FunnelStage } from "../../../Lib/admin";
import { prefersReducedMotion, formatCompact } from "../format";

// Status palette (reserved) — each stage ships with a label, never color alone.
const BUCKET_COLOR: Record<string, string> = {
  active: "#4d7dff",
  completed: "#34d399",
  cancelled: "#f87171",
};

/**
 * Delivery status funnel — horizontal magnitude bars grouped by real status.
 * Bar length encodes count; the status color is reserved (good/neutral/bad) and
 * always accompanied by the status label.
 */
export default function StatusFunnel({ stages }: { stages: FunnelStage[] }) {
  const reducedMotion = prefersReducedMotion();
  const max = Math.max(...stages.map((s) => s.count), 1);

  if (stages.length === 0) {
    return (
      <div className="text-[#a0a0b0] text-sm py-6 text-center">
        No deliveries yet
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {stages.map((s, i) => {
        const color = BUCKET_COLOR[s.bucket] ?? "#4d7dff";
        const pct = Math.max((s.count / max) * 100, 2);
        return (
          <div key={`${s.status}-${i}`} className="flex items-center gap-3">
            <span className="w-24 text-xs text-[#a0a0b0] capitalize truncate shrink-0">
              {s.status.replace(/_/g, " ")}
            </span>
            <div className="flex-1 h-6 rounded-md bg-white/[0.03] overflow-hidden">
              <motion.div
                className="h-full rounded-md flex items-center justify-end pr-2"
                style={{ background: color }}
                initial={reducedMotion ? { width: `${pct}%` } : { width: 0 }}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.5, delay: reducedMotion ? 0 : i * 0.05 }}
              >
                <span className="text-[10px] font-semibold text-black/70">
                  {formatCompact(s.count)}
                </span>
              </motion.div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
