import { motion } from "framer-motion";
import { MapPin } from "lucide-react";
import type { Hotzone } from "../../../Lib/admin";
import { prefersReducedMotion, formatCompact } from "../format";

/**
 * Renders delivery/rider hotzones as a ranked intensity list. Uses a single-hue
 * sequential encoding (brand blue, light→dark by intensity) per dataviz rules —
 * magnitude is a job for sequential color, not categorical. Intensity is also
 * encoded by bar length so it never relies on color alone.
 */
export default function Hotzones({
  zones,
  accent = "23, 90, 255",
}: {
  zones: Hotzone[];
  /** RGB triplet string for the sequential hue. */
  accent?: string;
}) {
  const reducedMotion = prefersReducedMotion();

  if (zones.length === 0) {
    return (
      <div className="glass-card rounded-xl px-4 py-8 text-center text-[#a0a0b0] text-sm">
        No location data yet
      </div>
    );
  }

  return (
    <div className="space-y-1.5">
      {zones.map((z, i) => {
        const intensity = Math.max(z.intensity, 0.08);
        return (
          <motion.div
            key={`${z.lat}-${z.lng}-${i}`}
            initial={reducedMotion ? {} : { opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.25, delay: reducedMotion ? 0 : i * 0.015 }}
            className="relative rounded-lg overflow-hidden border border-white/[0.06]"
          >
            {/* sequential heat fill (length + opacity = magnitude) */}
            <div
              className="absolute inset-y-0 left-0"
              style={{
                width: `${intensity * 100}%`,
                background: `rgba(${accent}, ${0.15 + intensity * 0.5})`,
              }}
            />
            <div className="relative flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-[#a0a0b0] text-xs w-5 shrink-0">
                  #{i + 1}
                </span>
                <MapPin className="w-3.5 h-3.5 text-[#4d7dff] shrink-0" />
                <span className="text-white text-sm truncate font-mono">
                  {z.label}
                </span>
              </div>
              <span className="text-white text-sm font-semibold shrink-0 ml-2">
                {formatCompact(z.count)}
              </span>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
