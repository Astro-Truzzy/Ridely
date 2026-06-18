import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { IoArrowForward } from "react-icons/io5";
import signup from "../../assets/Images/signup.png";
import bookrider from "../../assets/Images/upscalemedia-transformed (1).png";
import details from "../../assets/Images/package-location-3d-icon-download-in-png-blend-fbx-gltf-file-formats--parcel-delivery-tracking-and-navigation-pack-services-icons-7191762-removebg-preview.png";
import otw from "../../assets/Images/delivered-removebg-preview.png";
import processRiderBg from "../../assets/generated/process-rider.jpg";

gsap.registerPlugin(useGSAP, ScrollTrigger);

const STEPS = [
  {
    id: 1,
    img: signup,
    title: "Sign Up",
    description:
      "Easily create an account in seconds and access a smooth delivery experience instantly.",
  },
  {
    id: 2,
    img: bookrider,
    title: "Book a Rider",
    description:
      "Quickly request a nearby dispatch rider with just a few taps on the app.",
  },
  {
    id: 3,
    img: details,
    title: "Enter details",
    description:
      "Fill in pickup and delivery info, choose parcel size, and get instant cost estimates.",
  },
  {
    id: 4,
    img: otw,
    title: "OTW!",
    description:
      "Track your package in real-time and enjoy timely, secure deliveries to your doorstep.",
  },
];

const Process = () => {
  const sectionRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.from(".process-card", {
        y: 60,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
          once: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-28 bg-[#0a0a0f] overflow-hidden"
      id="Process"
    >
      {/* Subtle background image */}
      <div className="absolute inset-0 z-0">
        <img
          src={processRiderBg}
          alt=""
          className="w-full h-full object-cover opacity-10"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f] via-[#0a0a0f]/90 to-[#0a0a0f]" />
      </div>

      <div className="container relative z-10 px-4">
        <div className="text-center mb-14 lg:mb-16">
          <p className="text-sm uppercase tracking-widest text-[#175aff] font-semibold mb-3">
            Simple & Fast
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
            How It <span className="text-[#175aff]">Works</span>
          </h2>
        </div>

        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4 max-w-6xl">
            {STEPS.map((step, index) => (
              <div key={step.id} className="relative flex items-stretch">
                <div className="process-card glass-card rounded-2xl p-6 flex flex-col items-center text-center gap-4 w-full min-h-[300px] hover:border-[#175aff]/30 transition-colors duration-300 group">
                  <div className="w-16 h-16 rounded-xl bg-[#175aff]/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <img
                      src={step.img}
                      alt=""
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <span className="text-xs font-bold text-[#175aff] uppercase tracking-wider">
                    Step {step.id}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-bold text-white">
                    {step.title}
                  </h3>
                  <p className="text-sm text-[#a0a0b0] leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Desktop connecting arrow */}
                {index < STEPS.length - 1 && (
                  <div className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 z-20 text-[#175aff]/50">
                    <IoArrowForward className="text-2xl" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
