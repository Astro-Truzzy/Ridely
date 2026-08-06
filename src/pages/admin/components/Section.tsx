import { motion } from "framer-motion";
import { prefersReducedMotion } from "../format";

interface SectionProps {
  title: string;
  subtitle?: string;
  actions?: React.ReactNode;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

/** Titled section wrapper with a consistent header row. */
export default function Section({
  title,
  subtitle,
  actions,
  icon,
  children,
}: SectionProps) {
  const reducedMotion = prefersReducedMotion();
  return (
    <motion.section
      initial={reducedMotion ? {} : { opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-[#4d7dff]">{icon}</span>}
          <div>
            <h2 className="text-lg font-semibold text-white leading-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs text-[#a0a0b0] mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>
        {actions && <div className="flex items-center gap-2">{actions}</div>}
      </div>
      {children}
    </motion.section>
  );
}
