import { useRef } from "react";
import { IoMdPin } from "react-icons/io";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import { FaDoorOpen, FaMoneyCheckAlt, FaBoxes } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import featureBookDelivery from "../assets/generated/feature-book-delivery.jpg";
import featureTracking from "../assets/generated/feature-tracking.jpg";
import featureDoorstep from "../assets/generated/feature-doorstep.jpg";
import featureInsurance from "../assets/generated/feature-insurance.jpg";
import featureBulk from "../assets/generated/feature-bulk.jpg";
import featurePayments from "../assets/generated/feature-payments.jpg";
import phoneMockup from "../assets/Images/LocMock.png";

const featureData = [
  {
    icon: <IoMdPin />,
    title: "Book a delivery",
    desc: "Request in seconds, delivered in minutes.",
    cta: "Book delivery",
    image: featureBookDelivery,
    phoneMockup,
    dark: true,
    first: true,
  },
  {
    icon: <FaDoorOpen />,
    title: "Doorstep Delivery",
    desc: "Send parcels directly to the recipient's doorstep with live updates.",
    cta: "Book delivery",
    image: featureDoorstep,
    dark: true,
  },
  {
    icon: <MdSecurity />,
    title: "Package Insurance",
    desc: "Protect valuable shipments against loss and damage in transit.",
    cta: "Get protected",
    image: featureInsurance,
    dark: true,
  },
  {
    icon: <FaBoxes />,
    title: "Bulk Delivery",
    desc: "Dispatch multiple packages for businesses with one coordinated flow.",
    cta: "Scale dispatch",
    image: featureBulk,
    dark: true,
  },
  {
    icon: <FaMoneyCheckAlt />,
    title: "Flexible Payments",
    desc: "Pay with card, transfer, or cash using secure checkout options.",
    cta: "Choose payment",
    image: featurePayments,
    dark: true,
  },
  {
    icon: <IoMdPin />,
    title: "Real-Time Tracking",
    desc: "Track rider location and delivery progress from pickup to drop-off.",
    cta: "Track now",
    image: featureTracking,
    dark: true,
  },
];

const PrioritySec = () => {
  const scrollerRef = useRef<HTMLDivElement>(null);

  const scrollByCard = (direction: "prev" | "next") => {
    if (!scrollerRef.current) return;
    const amount = Math.max(320, scrollerRef.current.clientWidth * 0.72);
    scrollerRef.current.scrollBy({
      left: direction === "next" ? amount : -amount,
      behavior: "smooth",
    });
  };

  const handleWheelScroll = (event: React.WheelEvent<HTMLDivElement>) => {
    if (!scrollerRef.current) return;
    if (Math.abs(event.deltaY) <= Math.abs(event.deltaX)) return;

    event.preventDefault();
    scrollerRef.current.scrollBy({
      left: event.deltaY,
      behavior: "auto",
    });
  };

  return (
    <section id="Services" className="w-full py-20 md:py-24 px-4 md:px-8 bg-[#111118]">
      <div className="max-w-[1320px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-6xl font-black text-white tracking-tight">
            Our services
          </h2>
          <p className="mt-4 text-base md:text-lg text-[#a0a0b0] max-w-2xl mx-auto">
            Book a rider, track your parcel, and get it to the doorstep — all
            from the Ridely app.
          </p>
        </div>

        <div className="relative pb-16 md:pb-20">
          <div
            ref={scrollerRef}
            onWheel={handleWheelScroll}
            className="services-scroll-track flex gap-4 md:gap-5 overflow-x-auto snap-x snap-mandatory pr-8 md:pr-24"
          >
            {featureData.map((item) => (
              <article
                key={item.title}
                className="group relative shrink-0 snap-start overflow-hidden rounded-2xl md:rounded-3xl h-[500px] md:h-[560px] w-[82vw] sm:w-[58vw] lg:w-[31vw] min-w-[290px] max-w-[440px] border border-white/10 shadow-[0_20px_45px_rgba(0,0,0,0.28)]"
              >
                <img
                  src={item.image}
                  alt={`${item.title} service`}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-b from-[#061014]/25 via-[#061014]/52 to-[#061014]/88" />

                <div className="relative z-10 h-full p-6 md:p-7 flex flex-col">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl mb-4 bg-white/15 text-white">
                    {item.icon}
                  </div>

                  <h3 className="text-[1.9rem] leading-tight font-bold text-white">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-[1.05rem] md:text-[1.12rem] leading-snug text-white/85 max-w-[18rem]">
                    {item.desc}
                  </p>

                  <div className="mt-auto pt-6">
                    <button
                      type="button"
                      className="rounded-xl px-5 py-2.5 text-base font-semibold transition-colors bg-[#157aff] text-white hover:bg-blue-700"
                    >
                      {item.cta}
                    </button>
                  </div>
                </div>

                {item.first && item.phoneMockup && (
                  <div className="ridely-app-preview pointer-events-none">
                    {/* <img
                      src={item.phoneMockup}
                      alt="Ridely app home screen on iPhone"
                      className="ridely-phone-mockup"
                    /> */}
                  </div>
                )}
              </article>
            ))}
          </div>

          <div className="absolute right-1 md:right-2 bottom-0 flex items-center gap-2">
            <button
              type="button"
              onClick={() => scrollByCard("prev")}
              className="services-scroll-arrow"
              aria-label="Scroll to previous services"
            >
              <IoChevronBack />
            </button>
            <button
              type="button"
              onClick={() => scrollByCard("next")}
              className="services-scroll-arrow"
              aria-label="Scroll to next services"
            >
              <IoChevronForward />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrioritySec;
