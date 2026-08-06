import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, X } from "lucide-react";

export default function ThankYouPopup({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (show) {
      let start = 0;
      const interval = setInterval(() => {
        start += 1;
        setProgress(start);
        if (start >= 100) {
          clearInterval(interval);
          onClose();
        }
      }, 50);

      return () => clearInterval(interval);
    } else {
      setProgress(0);
    }
  }, [show, onClose]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 40 }}
          transition={{ duration: 0.4 }}
          className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8 left-4 sm:left-auto bg-[#111118] border border-white/[0.08] backdrop-blur-xl shadow-2xl shadow-black/50 rounded-xl p-4 sm:p-6 flex items-center gap-3 sm:gap-4 z-[60] max-w-sm sm:max-w-md"
        >
          <CheckCircle className="text-[#4d7dff] w-6 h-6 shrink-0" />
          <div className="min-w-0 flex-1">
            <h4 className="text-base sm:text-lg font-semibold text-white">
              You&apos;re on the list!
            </h4>
            <p className="text-sm text-[#a0a0b0]">
              Thanks for joining{" "}
              <span className="text-[#175aff] font-medium">Ridely</span>.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#a0a0b0] hover:text-white hover:bg-white/[0.06] transition-colors shrink-0"
            aria-label="Close notification"
          >
            <X className="w-4 h-4" />
          </button>
          <svg
            className="w-9 h-9 sm:w-10 sm:h-10 shrink-0"
            viewBox="0 0 36 36"
            aria-hidden="true"
          >
            <path
              className="text-white/[0.08]"
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <motion.path
              d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#175aff"
              strokeWidth="2"
              strokeDasharray="100, 100"
              strokeDashoffset={100 - progress}
              initial={{ strokeDashoffset: 100 }}
              animate={{ strokeDashoffset: 100 - progress }}
            />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
