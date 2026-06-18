import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HiX } from "react-icons/hi";

const STORAGE_KEY = "ridely-sticky-bar-dismissed";

interface StickySignupBarProps {
  onOpenModal: () => void;
}

export default function StickySignupBar({ onOpenModal }: StickySignupBarProps) {
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const wasDismissed = localStorage.getItem(STORAGE_KEY) === "true";
    setDismissed(wasDismissed);

    const handleScroll = () => {
      if (wasDismissed) return;

      const scrollPercent =
        window.scrollY /
        (document.documentElement.scrollHeight - window.innerHeight);
      const footer = document.querySelector("footer");
      const footerTop = footer?.getBoundingClientRect().top ?? Infinity;
      const nearFooter = footerTop < window.innerHeight + 80;

      setVisible(scrollPercent > 0.3 && !nearFooter);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
    setVisible(false);
  };

  if (dismissed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-0 left-0 right-0 z-999 px-4 py-3"
          style={{
            background: "linear-gradient(135deg, #175aff 0%, #0f49d1 50%, #175aff 100%)",
            boxShadow: "0 -4px 24px rgba(23,90,255,0.35)",
          }}
        >
          <div className="max-w-5xl mx-auto flex items-center justify-between gap-4">
            <p className="text-white text-sm md:text-base font-semibold flex-1">
              🚀 Ridely is launching soon — Be the first to know
            </p>
            <button
              onClick={onOpenModal}
              className="flex-shrink-0 bg-white text-[#175aff] font-bold px-5 py-2 rounded-full text-sm hover:bg-gray-100 transition-colors"
            >
              Join Waitlist
            </button>
            <button
              onClick={handleDismiss}
              aria-label="Dismiss"
              className="flex-shrink-0 text-white/80 hover:text-white p-1"
            >
              <HiX className="w-5 h-5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
