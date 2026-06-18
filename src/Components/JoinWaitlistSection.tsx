import { motion } from "framer-motion";
import { FaShieldAlt, FaUsers, FaRocket } from "react-icons/fa";

interface JoinWaitlistSectionProps {
  onOpenModal: () => void;
}

const trustIndicators = [
  { icon: FaUsers, text: "2,000+ early signups" },
  { icon: FaShieldAlt, text: "Verified riders" },
  { icon: FaRocket, text: "Launching in Benin City" },
];

export default function JoinWaitlistSection({
  onOpenModal,
}: JoinWaitlistSectionProps) {
  return (
    <section
      id="Waitlist"
      className="relative min-h-screen flex items-center justify-center overflow-hidden px-6 py-24"
      style={{ background: "#0a0a0f" }}
    >
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 rounded-full opacity-30"
          style={{
            background:
              "radial-gradient(circle, rgba(23,90,255,0.6) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{
            x: [0, -60, 0],
            y: [0, 50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-24 -right-24 w-[28rem] h-[28rem] rounded-full opacity-25"
          style={{
            background:
              "radial-gradient(circle, rgba(77,125,255,0.5) 0%, transparent 70%)",
          }}
        />
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, 30, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[32rem] h-[32rem] rounded-full opacity-10"
          style={{
            background:
              "radial-gradient(circle, rgba(23,90,255,0.4) 0%, transparent 60%)",
          }}
        />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <span
          className="inline-block text-xs font-bold uppercase tracking-widest mb-6 px-3 py-1 rounded-full"
          style={{
            color: "#175aff",
            background: "rgba(23,90,255,0.12)",
            border: "1px solid rgba(23,90,255,0.3)",
          }}
        >
          Early Access
        </span>

        <h2 className="text-4xl md:text-6xl font-extrabold text-white leading-tight mb-6">
          Nigeria's Delivery Revolution{" "}
          <span style={{ color: "#175aff" }}>Starts With You</span>
        </h2>

        <p
          className="text-lg md:text-xl mb-10 max-w-xl mx-auto"
          style={{ color: "#a0a0b0" }}
        >
          Join thousands of customers and riders on the waitlist. Be first to
          experience fast, trackable deliveries built for Nigerian streets.
        </p>

        <motion.button
          onClick={onOpenModal}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          className="font-bold px-10 py-4 rounded-full text-white text-lg mb-12"
          style={{
            background: "linear-gradient(135deg, #175aff, #4d7dff)",
            boxShadow: "0 0 40px rgba(23,90,255,0.45)",
          }}
        >
          Join the Waitlist →
        </motion.button>

        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {trustIndicators.map(({ icon: Icon, text }, i) => (
            <div
              key={i}
              className="flex items-center gap-2 text-sm font-medium"
              style={{ color: "#a0a0b0" }}
            >
              <Icon className="text-[#175aff] text-lg" />
              {text}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
