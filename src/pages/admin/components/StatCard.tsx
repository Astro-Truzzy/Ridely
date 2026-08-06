import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { prefersReducedMotion, formatCompact, formatNaira } from "../format";

interface StatCardProps {
  label: string;
  value: number | string;
  sub?: string;
  format?: "number" | "naira";
  icon?: React.ReactNode;
}

export default function StatCard({
  label,
  value,
  sub,
  format = "number",
  icon,
}: StatCardProps) {
  const [count, setCount] = useState(0);
  const reducedMotion = prefersReducedMotion();
  const targetValue = typeof value === "number" ? value : 0;

  useEffect(() => {
    if (reducedMotion || typeof value !== "number") {
      setCount(targetValue);
      return;
    }

    let start = 0;
    const duration = 800;
    const increment = targetValue / (duration / 16);
    let frame = 0;

    const timer = setInterval(() => {
      start += increment;
      frame++;
      if (start >= targetValue || frame * 16 >= duration) {
        setCount(targetValue);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);

    return () => clearInterval(timer);
  }, [value, targetValue, reducedMotion]);

  const displayValue =
    typeof value === "string"
      ? value
      : format === "naira"
        ? formatNaira(count)
        : formatCompact(count);

  return (
    <motion.div
      initial={reducedMotion ? {} : { opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={reducedMotion ? {} : { y: -2, transition: { duration: 0.15 } }}
      className="glass-card rounded-xl p-5 relative overflow-hidden"
    >
      {icon && (
        <div className="absolute top-4 right-4 text-[#4d7dff]/20 text-2xl">
          {icon}
        </div>
      )}
      <p className="text-[#a0a0b0] text-sm">{label}</p>
      <p className="text-3xl font-bold text-white mt-1">{displayValue}</p>
      {sub && <p className="text-xs text-[#a0a0b0] mt-1">{sub}</p>}
    </motion.div>
  );
}
