import DetMoc from "../../assets/Images/DetMock.png";
import LocMoc from "../../assets/Images/LocMock.png";
import TracMoc from "../../assets/Images/TracMoc.png";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const Mockup = () => {
  useEffect(() => {
    AOS.init({ duration: 800, once: false });
  }, []);

  return (
    <section className="w-full py-20 relative mock">
      {/* Overlay */}
      <div className="absolute inset-0  z-0"></div>

      <div className="relative z-10 container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 items-center justify-end gap-10 lg:translate-x-[2.2rem]">
        {/* Text Section */}
        <div data-aos="fade-right" className="text-white space-y-6">
          <h2 className="text-4xl lg:text-5xl font-bold">Simple & Intuitive</h2>
          <p className="text-lg leading-relaxed max-w-xl">
            Ridely is designed to make booking deliveries seamless, smart, and
            stress-free. From finding a rider to live tracking your parcel,
            every step is effortless and user-friendly—because simplicity should
            always feel this smooth.
          </p>
        </div>

        {/* Images Section */}
        <div className="relative flex justify-center items-center translate-x-[4.5rem] h-[500px]">
          <img
            src={TracMoc}
            alt="Tracking Mockup"
            className="absolute w-[220px] sm:w-[240px] md:w-[260px] rotate-[260deg] z-10 translate-x-[-5rem] translate-y-[2rem]"
            data-aos="fade-up"
          />
          <img
            src={LocMoc}
            alt=" Mockup"
            className="absolute w-[240px] sm:w-[240px] md:w-[260px] rotate-[-30deg] z-20 translate-x-[-6rem] translate-y-[-5rem]"
            data-aos="fade-up"
            data-aos-delay="200"
          />
          <img
            src={DetMoc}
            alt="Details Mockup"
            className="relative w-[240px] sm:w-[250px] md:w-[260px] z-30 translate-y-[-3rem] translate-x-[1.4rem] "
            data-aos="fade-up"
            data-aos-delay="400"
          />
        </div>
      </div>
    </section>
  );
};

export default Mockup;
