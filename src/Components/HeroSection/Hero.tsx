import React, { ReactNode } from "react";
import Slider from "react-slick";
import Image1 from "../../assets/Illustrations/book.png";
import Image2 from "../../assets/Illustrations/locationparcel.png";
import Image3 from "../../assets/Illustrations/doorstep.png";
import Image4 from "../../assets/Illustrations/savetime.png";
import { IoPhonePortraitOutline } from "react-icons/io5";
import { FaMailchimp } from "react-icons/fa";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import { FaShippingFast } from "react-icons/fa";
import { useState } from "react";
import WaitlistModal from "../WaitlistModal";

// Define the shape of a Hero item
interface HeroItem {
  id: number;
  img: string;
  subtitle: string;
  title: string;
  title2: string;
  description: string;
  icon: ReactNode;
}

// Refined Hero Data
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

const Hero: React.FC = () => {

const [showModal, setShowModal] = useState(false);

const handleOpenModal = () => setShowModal(true);
const handleCloseModal = () => setShowModal(false);

  const settings = {
    dots: true,
    arrows: false,
    infinite: true,
    speed: 800,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 4000,
    cssEase: "ease-in-out",
    pauseOnHover: true,
    pauseOnFocus: true,
  };

  return (
    <section className="container" id="Home">
      <div className="flex items-center justify-center p-[1rem] sm:p-[2rem]">
        <div className="overflow-hidden rounded-3xl min-h-[400px] sm:min-h-[650px] pt-5 bg-white flex justify-center items-center px-5 mt-5">
          <div className="container pb-8 sm:pb-0 pl-1">
            <Slider {...settings}>
              {HeroData.map((data: HeroItem) => (
                <div key={data.id}>
                  <div className="grid grid-cols-1 sm:grid-cols-2">
                    {/* Text Content Section */}
                    <div className="flex flex-col justify-center gap-4 sm:pl-3 pt-12 sm:pt-0 text-center sm:text-left order-2 sm:order-1 relative z-10">
                      <h1
                        data-aos="zoom-out"
                        data-aos-duration="500"
                        data-aos-once="true"
                        className="text-2xl sm:text-4xl lg:text-3xl font-semibold text-gray-700"
                      >
                        <p className="text-[30px] flex justify-center sm:justify-start text-[#175aff]">
                          {data.icon}
                        </p>
                        {data.subtitle}
                      </h1>
                      <h1
                        data-aos="zoom-out"
                        data-aos-duration="500"
                        data-aos-once="true"
                        className="text-5xl sm:text-6xl lg:text-7xl font-bold text-gray-900"
                      >
                        {data.title}
                      </h1>
                      <p
                        data-aos="fade-left"
                        data-aos-duration="500"
                        data-aos-once="true"
                        className="text-base sm:text-lg text-gray-600 max-w-md"
                      >
                        {data.description}
                      </p>
                      <h1
                        data-aos="zoom-out"
                        data-aos-duration="500"
                        data-aos-once="true"
                        className="text-5xl uppercase text-[#175AFF] sm:text-[60px] md:text-[80px] xl:text-[100px] font-bold"
                      >
                        {data.title2}
                      </h1>
                    </div>

                    {/* Image Section */}
                    <div className="order-1 sm:order-2">
                      <div
                        data-aos="fade-right"
                        data-aos-duration="300"
                        data-aos-once="true"
                        data-aos-delay="200"
                        className="relative z-10"
                      >
                        <img
                          src={data.img}
                          alt={`${data.title2} illustration`}
                          className="w-[300px] sm:w-[450px] h-[300px] sm:h-[350px] 
                        sm:scale-105 object-contain mx-auto drop-shadow-[-8px_4px_6px_rgba(0,0,0,0.2)] relative z-40"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>

      <div className=" flex items-center justify-center">
        <button
          data-aos="fade-up"
          data-aos-duration="400"
          data-aos-once="false"
          data-aos-delay="200"
          type="button"
          title="Get Started"
          onClick={handleOpenModal}
          className="mt-[2.5rem] px-4 sm:px-6 py-2 sm:py-3 w-[120px] sm:w-[150px] md:w-[180px] h-[45px] sm:h-[50px] lg:h-[55px]
             bg-[#175aff] text-white text-sm sm:text-base md:text-lg font-semibold
             rounded-xl shadow-md hover:bg-blue-400 transition duration-300"
        >
          Get started
        </button>
        {/* Modal Component */}
        <WaitlistModal show={showModal} onClose={handleCloseModal} />
      </div>
    </section>
  );
};

export default Hero;
