import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, LogOut, RefreshCw, X } from "lucide-react";
import ridelyLogo from "../../../assets/brand";
import { prefersReducedMotion } from "../format";
import type { NavItem, SectionId } from "../nav";

interface SidebarProps {
  nav: NavItem[];
  active: SectionId;
  onSelect: (id: SectionId) => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onRefresh: () => void;
  onLogout: () => void;
  refreshing: boolean;
  /** Mobile slide-over open state. */
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

function NavButton({
  item,
  active,
  collapsed,
  onSelect,
}: {
  item: NavItem;
  active: boolean;
  collapsed: boolean;
  onSelect: (id: SectionId) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onSelect(item.id)}
      title={collapsed ? item.label : undefined}
      className={`group relative flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
        active
          ? "text-white"
          : "text-[#a0a0b0] hover:text-white hover:bg-white/[0.04]"
      }`}
    >
      {active && (
        <motion.span
          layoutId="active-pill"
          className="absolute inset-0 rounded-xl bg-[#175aff]/15 border border-[#175aff]/30"
          transition={{ type: "spring", stiffness: 400, damping: 32 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-3 w-full">
        {item.icon}
        <AnimatePresence initial={false}>
          {!collapsed && (
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: "auto" }}
              exit={{ opacity: 0, width: 0 }}
              transition={{ duration: 0.15 }}
              className="whitespace-nowrap overflow-hidden"
            >
              {item.label}
            </motion.span>
          )}
        </AnimatePresence>
        {item.badge ? (
          <span
            className={`relative z-10 ml-auto min-w-[18px] h-[18px] px-1 rounded-full bg-[#175aff] text-white text-[10px] font-bold flex items-center justify-center ${
              collapsed ? "absolute -top-0.5 -right-0.5" : ""
            }`}
          >
            {item.badge}
          </span>
        ) : null}
      </span>
    </button>
  );
}

function SidebarInner({
  nav,
  active,
  onSelect,
  collapsed,
  onToggleCollapse,
  onRefresh,
  onLogout,
  refreshing,
  onCloseMobile,
  isMobile,
}: Omit<SidebarProps, "mobileOpen"> & { isMobile: boolean }) {
  return (
    <div className="flex flex-col h-full">
      {/* Brand + collapse toggle */}
      <div className="flex items-center justify-between px-3 py-4 h-16">
        {!collapsed && <img src={ridelyLogo} alt="Ridely" className="h-7" />}
        {isMobile ? (
          <button
            onClick={onCloseMobile}
            className="p-1.5 text-[#a0a0b0] hover:text-white rounded-lg"
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        ) : (
          <button
            onClick={onToggleCollapse}
            className="p-1.5 text-[#a0a0b0] hover:text-white rounded-lg hover:bg-white/5 transition-colors"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <motion.span
              animate={{ rotate: collapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="block"
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.span>
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-1 overflow-y-auto scrollbar-hide">
        {nav.map((item) => (
          <NavButton
            key={item.id}
            item={item}
            active={active === item.id}
            collapsed={collapsed}
            onSelect={(id) => {
              onSelect(id);
              if (isMobile) onCloseMobile();
            }}
          />
        ))}
      </nav>

      {/* Footer actions */}
      <div className="px-2 py-3 border-t border-white/[0.06] space-y-1">
        <button
          onClick={onRefresh}
          title={collapsed ? "Refresh" : undefined}
          className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm font-medium text-[#a0a0b0] hover:text-white hover:bg-white/[0.04] transition-colors"
        >
          <RefreshCw className={`w-5 h-5 shrink-0 ${refreshing ? "animate-spin" : ""}`} />
          {!collapsed && <span>Refresh</span>}
        </button>
        <button
          onClick={onLogout}
          title={collapsed ? "Log out" : undefined}
          className="flex items-center gap-3 w-full rounded-xl px-3 py-2.5 text-sm font-medium text-[#a0a0b0] hover:text-red-300 hover:bg-red-500/[0.06] transition-colors"
        >
          <LogOut className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Log out</span>}
        </button>
      </div>
    </div>
  );
}

export default function Sidebar(props: SidebarProps) {
  const { collapsed, mobileOpen, onCloseMobile } = props;
  const reducedMotion = prefersReducedMotion();

  return (
    <>
      {/* Desktop rail */}
      <motion.aside
        animate={{ width: collapsed ? 76 : 240 }}
        transition={{ duration: reducedMotion ? 0 : 0.25, ease: "easeInOut" }}
        className="hidden lg:flex flex-col fixed inset-y-0 left-0 z-40 border-r border-white/[0.08] bg-[#0c0c14]"
      >
        <SidebarInner {...props} isMobile={false} />
      </motion.aside>

      {/* Mobile slide-over */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 400, damping: 40 }}
              className="lg:hidden fixed inset-y-0 left-0 z-50 w-64 border-r border-white/[0.08] bg-[#0c0c14]"
            >
              <SidebarInner {...props} collapsed={false} isMobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
