import { motion } from "framer-motion";
import { Package, UserPlus, ShieldCheck, Activity } from "lucide-react";
import type { ActivityItem } from "../../../Lib/admin";
import { prefersReducedMotion, formatDate } from "../format";

const ICONS: Record<string, React.ReactNode> = {
  delivery: <Package className="w-4 h-4" />,
  user: <UserPlus className="w-4 h-4" />,
  rider: <ShieldCheck className="w-4 h-4" />,
};

const ICON_TINT: Record<string, string> = {
  delivery: "text-[#4d7dff] bg-[#175aff]/10",
  user: "text-[#c084fc] bg-purple-500/10",
  rider: "text-[#34d399] bg-emerald-500/10",
};

export default function ActivityFeed({ items }: { items: ActivityItem[] }) {
  const reducedMotion = prefersReducedMotion();

  if (items.length === 0) {
    return (
      <div className="text-[#a0a0b0] text-sm py-6 text-center flex flex-col items-center gap-2">
        <Activity className="w-5 h-5 opacity-50" />
        No recent activity
      </div>
    );
  }

  return (
    <div className="space-y-0.5 max-h-[420px] overflow-y-auto scrollbar-hide -mx-1 px-1">
      {items.map((item, i) => (
        <motion.div
          key={`${item.type}-${item.at}-${i}`}
          initial={reducedMotion ? {} : { opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: reducedMotion ? 0 : i * 0.01 }}
          className="flex items-center gap-3 py-2 px-1 rounded-lg hover:bg-white/[0.02]"
        >
          <span
            className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
              ICON_TINT[item.type] ?? "text-[#a0a0b0] bg-white/5"
            }`}
          >
            {ICONS[item.type] ?? <Activity className="w-4 h-4" />}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm text-white truncate capitalize">
              {item.label.replace(/_/g, " ")}
            </p>
            <p className="text-xs text-[#a0a0b0]">{item.sub}</p>
          </div>
          {item.at && (
            <span className="text-[10px] text-[#a0a0b0]/70 shrink-0 whitespace-nowrap">
              {formatDate(item.at)}
            </span>
          )}
        </motion.div>
      ))}
    </div>
  );
}
