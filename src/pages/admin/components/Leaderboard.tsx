import { motion } from "framer-motion";
import { Trophy } from "lucide-react";
import { prefersReducedMotion } from "../format";

interface LeaderRow {
  id: string;
  name: string;
  primary: string; // formatted headline metric
  secondary: string; // formatted sub metric
}

export default function Leaderboard({
  title,
  rows,
  accent = "#175aff",
}: {
  title: string;
  rows: LeaderRow[];
  accent?: string;
}) {
  const reducedMotion = prefersReducedMotion();

  return (
    <div className="glass-card rounded-xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Trophy className="w-4 h-4" style={{ color: accent }} />
        <h3 className="text-white font-medium">{title}</h3>
      </div>
      {rows.length === 0 ? (
        <p className="text-[#a0a0b0] text-sm py-4 text-center">No data yet</p>
      ) : (
        <div className="space-y-1">
          {rows.map((r, i) => (
            <motion.div
              key={r.id}
              initial={reducedMotion ? {} : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: reducedMotion ? 0 : i * 0.03 }}
              className="flex items-center gap-3 py-1.5"
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                  i < 3 ? "text-black" : "text-[#a0a0b0] bg-white/5"
                }`}
                style={i < 3 ? { background: accent } : undefined}
              >
                {i + 1}
              </span>
              <span className="text-sm text-white truncate flex-1">{r.name}</span>
              <div className="text-right shrink-0">
                <p className="text-sm text-white font-semibold">{r.primary}</p>
                <p className="text-[10px] text-[#a0a0b0]">{r.secondary}</p>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
