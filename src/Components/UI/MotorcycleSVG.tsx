import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface MotorcycleSVGProps {
  className?: string;
}

const MotorcycleSVG: React.FC<MotorcycleSVGProps> = ({ className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const riderRef = useRef<HTMLDivElement>(null);
  const rearWheelRef = useRef<SVGGElement>(null);
  const frontWheelRef = useRef<SVGGElement>(null);
  const packageRef = useRef<SVGGElement>(null);
  const speedLinesRef = useRef<SVGGElement>(null);

  useGSAP(
    () => {
      const rider = riderRef.current;
      const rearWheel = rearWheelRef.current;
      const frontWheel = frontWheelRef.current;
      const pkg = packageRef.current;
      const speedLines = speedLinesRef.current;

      if (!rider || !rearWheel || !frontWheel) return;

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(rider, { x: "50%", xPercent: -50, opacity: 0.7 });
        return;
      }

      const rideTimeline = () => {
        gsap.set(rider, { x: "-30vw", scale: 0.9, opacity: 0 });
        if (speedLines) gsap.set(speedLines, { opacity: 0 });

        const tl = gsap.timeline();

        tl.to(rider, {
          x: "115vw",
          scale: 1.15,
          opacity: 1,
          duration: 5.5,
          ease: "power2.inOut",
        });

        tl.to(
          [rearWheel, frontWheel],
          {
            rotation: 1080,
            duration: 5.5,
            ease: "none",
            transformOrigin: "center center",
          },
          0
        );

        if (pkg) {
          tl.to(
            pkg,
            {
              y: -4,
              rotation: -6,
              duration: 0.15,
              yoyo: true,
              repeat: 15,
              ease: "sine.inOut",
              transformOrigin: "center center",
            },
            0
          );
        }

        if (speedLines) {
          tl.to(
            speedLines,
            { opacity: 0.85, duration: 0.25, ease: "power2.out" },
            0.15
          ).to(
            speedLines,
            { opacity: 0, duration: 0.6, ease: "power2.in" },
            4.7
          );
        }

        return tl;
      };

      const master = gsap.timeline({ repeat: -1, repeatDelay: 4 });
      master.add(rideTimeline());
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none w-full h-28 sm:h-32 overflow-visible ${className}`}
      aria-hidden="true"
    >
      <div
        ref={riderRef}
        className="absolute bottom-2 left-0 will-change-transform"
        style={{ width: "clamp(180px, 28vw, 280px)" }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 280 100"
          fill="none"
          width="100%"
          height="auto"
          aria-label="Dispatch rider on motorcycle"
        >
          {/* Speed lines */}
          <g ref={speedLinesRef} opacity={0}>
            <line x1="8" y1="42" x2="55" y2="42" stroke="#4d7dff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
            <line x1="0" y1="52" x2="48" y2="52" stroke="#175aff" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="12" y1="62" x2="60" y2="62" stroke="#4d7dff" strokeWidth="2" strokeLinecap="round" opacity="0.5" />
            <line x1="4" y1="72" x2="40" y2="72" stroke="#a0a0b0" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
          </g>

          {/* Rear wheel */}
          <g ref={rearWheelRef}>
            <circle cx="52" cy="72" r="22" stroke="#175aff" strokeWidth="4" />
            <circle cx="52" cy="72" r="9" stroke="#4d7dff" strokeWidth="2.5" />
            <line x1="52" y1="50" x2="52" y2="94" stroke="#4d7dff" strokeWidth="1.5" opacity="0.5" />
            <line x1="30" y1="72" x2="74" y2="72" stroke="#4d7dff" strokeWidth="1.5" opacity="0.5" />
          </g>

          {/* Front wheel */}
          <g ref={frontWheelRef}>
            <circle cx="218" cy="72" r="22" stroke="#175aff" strokeWidth="4" />
            <circle cx="218" cy="72" r="9" stroke="#4d7dff" strokeWidth="2.5" />
            <line x1="218" y1="50" x2="218" y2="94" stroke="#4d7dff" strokeWidth="1.5" opacity="0.5" />
            <line x1="196" y1="72" x2="240" y2="72" stroke="#4d7dff" strokeWidth="1.5" opacity="0.5" />
          </g>

          {/* Frame */}
          <path
            d="M74 72 L88 38 L145 30 L195 38 L202 72"
            stroke="#175aff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path d="M74 72 L52 72" stroke="#4d7dff" strokeWidth="3.5" strokeLinecap="round" />
          <path
            d="M195 38 L210 58 L218 72"
            stroke="#175aff"
            strokeWidth="3.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Fuel tank */}
          <path
            d="M98 30 Q125 18 160 24 L195 38 L145 44 L98 40 Z"
            fill="rgba(23,90,255,0.25)"
            stroke="#175aff"
            strokeWidth="2"
          />

          {/* Handlebars */}
          <path
            d="M188 34 L205 24 M188 34 L205 42"
            stroke="#a0a0b0"
            strokeWidth="3"
            strokeLinecap="round"
          />

          {/* Rider */}
          <ellipse cx="130" cy="20" rx="11" ry="12" fill="rgba(23,90,255,0.55)" stroke="#175aff" strokeWidth="2" />
          <path
            d="M130 32 Q125 48 118 58 Q145 58 138 46 Z"
            fill="rgba(23,90,255,0.55)"
            stroke="#175aff"
            strokeWidth="2"
          />
          {/* Helmet visor */}
          <path d="M122 18 Q130 14 138 18" stroke="#f5c842" strokeWidth="2" strokeLinecap="round" />

          {/* Delivery package on rack */}
          <g ref={packageRef}>
            <rect x="88" y="38" width="28" height="22" rx="3" fill="rgba(245,200,66,0.35)" stroke="#f5c842" strokeWidth="2" />
            <path d="M94 44 L110 44 M94 50 L106 50" stroke="#f5c842" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          </g>

          {/* Headlight */}
          <ellipse cx="238" cy="58" rx="8" ry="6" fill="rgba(245,200,66,0.5)" />
          <ellipse cx="238" cy="58" rx="4" ry="3" fill="#f5c842" />
          <path d="M246 58 L268 54 M246 58 L268 62" stroke="#f5c842" strokeWidth="2" strokeLinecap="round" opacity="0.7" />

          {/* Exhaust trail */}
          <circle cx="28" cy="66" r="4" fill="rgba(160,160,176,0.35)" />
          <circle cx="14" cy="60" r="5" fill="rgba(160,160,176,0.22)" />
          <circle cx="2" cy="52" r="6" fill="rgba(160,160,176,0.12)" />
        </svg>
      </div>
    </div>
  );
};

export default MotorcycleSVG;
