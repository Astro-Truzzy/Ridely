import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(useGSAP, ScrollTrigger);

interface StatItem {
  value: number;
  suffix: string;
  prefix?: string;
  label: string;
  isDecimal?: boolean;
}

const STATS: StatItem[] = [
  { value: 1200, suffix: "+", label: "Packages Delivered" },
  { value: 32, suffix: "%", label: "Average Savings" },
  { value: 4.9, suffix: "★", label: "Beta Release Rating", isDecimal: true },
  { value: 5, suffix: "", label: "Cities & Expanding" },
  { value: 2, suffix: "nd", prefix: "", label: "Place Techstars Hackathon" },
];

const StatsBar = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const counters = gsap.utils.toArray<HTMLElement>(".stat-counter");

      counters.forEach((el) => {
        const end = parseFloat(el.dataset.value || "0");
        const isDecimal = el.dataset.decimal === "true";
        const obj = { val: 0 };

        gsap.to(obj, {
          val: end,
          duration: 2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
          onUpdate: () => {
            el.textContent = isDecimal
              ? obj.val.toFixed(1)
              : Math.round(obj.val).toLocaleString();
          },
        });
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="bg-[#111118] border-y border-white/8 py-10 lg:py-14"
      aria-label="Ridely statistics"
    >
      <div className="container px-4">
        <div className="flex overflow-x-auto snap-x snap-mandatory lg:overflow-visible lg:grid lg:grid-cols-5 gap-0 scrollbar-hide">
          {STATS.map((stat, index) => (
            <div
              key={stat.label}
              className={`flex-shrink-0 snap-center w-[70vw] sm:w-[45vw] lg:w-auto flex flex-col items-center justify-center text-center px-6 py-4 ${
                index < STATS.length - 1
                  ? "lg:border-r lg:border-white/10"
                  : ""
              }`}
            >
              <p className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-2">
                {stat.prefix && (
                  <span className="text-[#f5c842]">{stat.prefix}</span>
                )}
                <span className="text-[#175aff] stat-counter" data-value={stat.value} data-decimal={stat.isDecimal ? "true" : "false"}>
                  0
                </span>
                <span className="text-[#f5c842]">{stat.suffix}</span>
              </p>
              <p className="text-sm sm:text-base text-[#a0a0b0] font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBar;
