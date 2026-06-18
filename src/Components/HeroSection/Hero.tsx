import React, { ReactNode, useRef } from "react";
import Slider from "react-slick";
import { IoChevronBack, IoChevronForward } from "react-icons/io5";
import Image1 from "../../assets/Illustrations/book.png";
import Image2 from "../../assets/Illustrations/locationparcel.png";
import Image3 from "../../assets/Illustrations/doorstep.png";
import Image4 from "../../assets/Illustrations/savetime.png";
import heroBgVideo from "../../assets/videos/2859-163617349_medium.mp4";
import heroPoster from "../../assets/generated/hero-bg.jpg";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { FaMailchimp } from "react-icons/fa";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { FaShippingFast } from "react-icons/fa";
import { useState } from "react";
import WaitlistModal from "../WaitlistModal";

interface HeroItem {
  id: number;
  img: string;
  subtitle: string;
  title: string;
  title2: string;
  description: string;
  icon: ReactNode;
}

const HeroData: HeroItem[] = [
  {
    id: 1,
    img: Image1,
    subtitle: "Fast & Reliable",
    title: "Book a Rider",
    title2: "Instantly",
    description:
      "Schedule a pickup in seconds and let Ridely handle the rest. Quick, convenient, and always available.",
    icon: <FaShippingFast />,
  },
  {
    id: 2,
    img: Image2,
    subtitle: "Seamless Booking",
    title: "Set Destination",
    title2: "Customize",
    description:
      "Enter the delivery address and parcel size to get an instant quote. Clear details for accurate dispatch.",
    icon: <IoPhonePortraitOutline />,
  },
  {
    id: 3,
    img: Image3,
    subtitle: "Trusted Riders",
    title: "Doorstep Delivery",
    title2: "Securely",
    description:
      "Your parcels are delivered safely and directly to the recipient — no stress, no delays.",
    icon: <IoShieldCheckmarkOutline />,
  },
  {
    id: 4,
    img: Image4,
    subtitle: "Smart Logistics",
    title: "Deliver Smarter",
    title2: "Save More",
    description:
      "Cut costs and avoid long queues. With Ridely, you get affordable delivery with zero hassle.",
    icon: <FaMailchimp />,
  },
];

const STAT_CHIPS = [
  { label: "1,200+ Deliveries" },
  { label: "4.9★ Rating" },
  { label: "32% Savings" },
];

interface ArrowProps {
  onClick?: () => void;
}

const PrevArrow = ({ onClick }: ArrowProps) => (
  <button
    type="button"
    onClick={onClick}
    className="hero-slick-arrow hero-slick-prev"
    aria-label="Previous slide"
  >
    <IoChevronBack />
  </button>
);

const NextArrow = ({ onClick }: ArrowProps) => (
  <button
    type="button"
    onClick={onClick}
    className="hero-slick-arrow hero-slick-next"
    aria-label="Next slide"
  >
    <IoChevronForward />
  </button>
);

const Hero: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const sliderRef = useRef<Slider>(null);

  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    pauseOnFocus: true,
    prevArrow: <PrevArrow />,
    nextArrow: <NextArrow />,
    appendDots: (dots: React.ReactNode) => (
      <div>
        <ul className="hero-slick-dots">{dots}</ul>
      </div>
    ),
    customPaging: () => <button type="button" className="hero-slick-dot" aria-label="Slide" />,
  };

  return (
    <section className="relative min-h-screen flex flex-col justify-center overflow-x-hidden overflow-y-visible" id="Home">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <video
          src={heroBgVideo}
          poster={heroPoster}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="w-full h-full object-cover"
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-[#0a0a0f]/70 to-[#0a0a0f]/95" />
      </div>

      {/* Content */}
      <div className="relative z-10 container px-4 pt-28 pb-32 lg:pt-32 lg:pb-36">
        {/* Headline + stat chips */}
        <div className="text-center mb-8 lg:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-white tracking-tight leading-tight mb-6">
            Nigeria&apos;s Most Reliable{" "}
            <span className="text-[#175aff]">Delivery App</span>
          </h1>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {STAT_CHIPS.map((chip) => (
              <span
                key={chip.label}
                className="glass-card px-4 py-2 rounded-full text-sm font-medium text-white/90"
              >
                {chip.label}
              </span>
            ))}
          </div>
        </div>

        {/* Carousel card */}
        <div className="hero-carousel-wrapper glass-card rounded-2xl lg:rounded-3xl p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto border border-white/10">
          <Slider ref={sliderRef} {...settings}>
            {HeroData.map((data: HeroItem) => (
              <div key={data.id}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center min-h-[280px] sm:min-h-[320px]">
                  <div className="flex flex-col justify-center gap-3 sm:gap-4 text-center sm:text-left order-2 sm:order-1">
                    <p className="text-[#175aff] text-2xl flex justify-center sm:justify-start">
                      {data.icon}
                    </p>
                    <p className="text-sm uppercase tracking-wider text-[#a0a0b0] font-medium">
                      {data.subtitle}
                    </p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                      {data.title}
                    </h2>
                    <p className="text-base text-[#a0a0b0] max-w-md mx-auto sm:mx-0">
                      {data.description}
                    </p>
                    <p className="text-4xl sm:text-5xl lg:text-6xl uppercase text-[#175AFF] font-bold">
                      {data.title2}
                    </p>
                  </div>

                  <div className="order-1 sm:order-2 flex justify-center">
                    <img
                      src={data.img}
                      alt={`${data.title2} illustration`}
                      loading={data.id === 1 ? "eager" : "lazy"}
                      decoding="async"
                      className="w-[240px] sm:w-[320px] lg:w-[380px] h-auto object-contain drop-shadow-2xl"
                    />
                  </div>
                </div>
              </div>
            ))}
          </Slider>
        </div>

        {/* CTA */}
        <div className="flex justify-center mt-8">
          <button
            type="button"
            title="Get Started"
            onClick={handleOpenModal}
            className="gradient-blue px-8 py-3.5 rounded-full text-base font-semibold shadow-lg shadow-[#175aff]/25"
          >
            Get started
          </button>
          <WaitlistModal show={showModal} onClose={handleCloseModal} />
        </div>
      </div>
    </section>
  );
};

export default Hero;
