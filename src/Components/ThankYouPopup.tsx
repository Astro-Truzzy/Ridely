import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle } from "lucide-react"; // Optional icon

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
          onClose(); // Close the modal
        }
      }, 50); // 50ms x 100 = 5s

      return () => clearInterval(interval);
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
          className="fixed bottom-8 right-8 bg-white border border-gray-200 shadow-xl rounded-lg p-6 flex items-center gap-4 z-50"
        >
          <CheckCircle className="text-green-500 w-6 h-6" />
          <div>
            <h4 className="text-lg font-semibold text-gray-800">
              Thank you for registering with{" "}
              <span className="text-[#175aff]">Ridely</span> 🎉
            </h4>
            <p className="text-sm text-gray-500">You’re being redirected...</p>
          </div>
          {/* Circular progress ring */}
          <svg className="w-10 h-10 ml-auto" viewBox="0 0 36 36">
            <path
              className="text-gray-200"
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
