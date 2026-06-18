import { useRef } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    quote:
      "Ridely saved my business! I sent 15 packages in one day and tracked every single one. My customers were blown away by the updates.",
    name: "Chioma A.",
    title: "Lagos Business Owner",
    initials: "CA",
  },
  {
    quote:
      "The rider was at my door in 20 minutes. Absolutely incredible service! I've tried other couriers and nothing comes close to this speed.",
    name: "Emeka O.",
    title: "Benin City",
    initials: "EO",
  },
  {
    quote:
      "32% cheaper than my previous courier and 3x more reliable. The real-time tracking is phenomenal. I'm never going back.",
    name: "Fatima B.",
    title: "Abuja Customer",
    initials: "FB",
  },
];

export default function Testimonials() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = containerRef.current?.querySelectorAll(".testimonial-card");
      if (!cards) return;

      gsap.fromTo(
        cards,
        { opacity: 0, y: 50 },
        {
          opacity: 1,
          y: 0,
          duration: 0.7,
          stagger: 0.15,
          ease: "power2.out",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            once: true,
          },
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      style={{ background: "#0a0a0f" }}
      className="w-full py-20 px-6 md:px-12 lg:px-20"
    >
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <span
            className="inline-block text-xs font-bold uppercase tracking-widest mb-4 px-3 py-1 rounded-full"
            style={{
              color: "#f5c842",
              background: "rgba(245,200,66,0.1)",
              border: "1px solid rgba(245,200,66,0.25)",
            }}
          >
            Customer Stories
          </span>
          <h2 className="text-3xl md:text-5xl font-extrabold text-white">
            What Our Customers Say
          </h2>
          <p className="mt-4 text-lg max-w-xl mx-auto" style={{ color: "#a0a0b0" }}>
            Real experiences from real people across Nigeria.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="testimonial-card rounded-2xl p-7 flex flex-col gap-5 opacity-0"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
              }}
            >
              {/* Stars */}
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, si) => (
                  <FaStar key={si} style={{ color: "#f5c842" }} className="text-sm" />
                ))}
              </div>

              {/* Quote */}
              <p className="text-base leading-relaxed flex-1" style={{ color: "#c0c0d0" }}>
                "{t.quote}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white flex-shrink-0"
                  style={{ background: "linear-gradient(135deg, #175aff, #4d7dff)" }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-white text-sm">{t.name}</p>
                  <p className="text-xs" style={{ color: "#a0a0b0" }}>
                    {t.title}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
