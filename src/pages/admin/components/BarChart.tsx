import { motion } from "framer-motion";
import { prefersReducedMotion } from "../format";

export interface BarDatum {
  label: string;
  value: number;
  /** Optional tooltip override; defaults to `${label}: ${value}`. */
  title?: string;
}

interface BarChartProps {
  data: BarDatum[];
  /** Accent color for the bars (single-series). Default brand blue. */
  color?: string;
  height?: number;
  /** Formats the value shown in the tooltip. */
  formatValue?: (v: number) => string;
}

/**
 * Lightweight single-series bar chart (div-based, no chart lib). Marks anchor to
 * the baseline with 4px rounded tops and a 2px gap between bars, per dataviz
 * mark specs. Hover reveals a per-bar tooltip.
 */
export default function BarChart({
  data,
  color = "#175aff",
  height = 160,
  formatValue = (v) => String(v),
}: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const reducedMotion = prefersReducedMotion();

  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-[#a0a0b0] text-sm"
        style={{ height }}
      >
        No data
      </div>
    );
  }

  return (
    <div className="flex items-end gap-1.5" style={{ height }}>
      {data.map((d, i) => {
        const pct = Math.max((d.value / max) * 100, d.value > 0 ? 4 : 0);
        return (
          <div
            key={`${d.label}-${i}`}
            className="flex-1 flex flex-col items-center gap-1 group min-w-0 h-full justify-end"
          >
            <div className="relative w-full flex justify-center">
              {/* tooltip */}
              <div className="absolute bottom-full mb-1.5 hidden group-hover:block z-10 whitespace-nowrap">
                <div className="bg-[#1a1a2e] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs shadow-xl">
                  <p className="text-white font-medium">{formatValue(d.value)}</p>
                  <p className="text-[#a0a0b0]">{d.title ?? d.label}</p>
                </div>
              </div>
              <motion.div
                className="w-full rounded-t-[4px]"
                style={{ background: color, minHeight: d.value > 0 ? 4 : 0 }}
                initial={reducedMotion ? { height: `${pct}%` } : { height: 0 }}
                animate={{ height: `${pct}%` }}
                transition={{ duration: 0.5, delay: reducedMotion ? 0 : i * 0.02 }}
              />
            </div>
            <span className="text-[10px] text-[#a0a0b0] text-center leading-tight truncate w-full">
              {d.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
