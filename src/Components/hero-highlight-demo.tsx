"use client";
import { motion } from "motion/react";
import { HeroHighlight } from "./UI/hero-highlight";


import LocMock from "../assets/Images/LocMock.png";
import DetMock from "../assets/Images/DetMock.png";
import TracMoc from "../assets/Images/TracMoc.png";

const images = [
  LocMock, // Top image
  DetMock, // Middle
  TracMoc, // Bottom
];

export default function HeroHighlightDemo() {
  return (
    <HeroHighlight className="w-full py-16 px-6 md:px-12 lg:px-20 flex flex-col md:flex-row items-center gap-12 overflow-hidden">
      <div className="md:w-1/2 space-y-6">
        <motion.h2
          initial={{ opacity: 0, y: -40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: false }}
          className="text-3xl md:text-5xl font-bold text-[#157aff]"
        >
          Simple & intuitive
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
          className="text-gray-300 text-lg md:text-xl"
        >
          Our platform is designed with user experience in mind. Easily track
          deliveries in real-time and manage logistics with just a few taps.
        </motion.p>
      </div>

      {/* Right Side Images */}
      <div className="md:w-1/2 relative flex justify-center items-center h-[400px] md:h-[500px]">
        {/* Bottom Image */}
        <motion.div
          initial={{ opacity: 0, y: 100, rotate: 0 }}
          whileInView={{ opacity: 1, y: 0, rotate: 40 }}
          transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
          viewport={{ once: false }}
          className="absolute w-54 md:w-72 lg:w-65  rounded-2xl overflow-hidden z-0 translate-x-[85px] translate-y-[-35px]"
        >
          <img src={images[2]} alt="Mockup 3" className="w-full h-auto" />
        </motion.div>

        {/* Middle Image */}
        <motion.div
          initial={{ opacity: 0, y: 100, rotate: -10 }}
          whileInView={{ opacity: 1, y: 0, rotate: -40 }}
          transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
          viewport={{ once: false }}
          className="absolute w-54 md:w-72 lg:w-65  rounded-2xl overflow-hidden z-10 transform ease-out translate-x-[-85px] translate-y-[-30px]"
        >
          <img src={images[1]} alt="Mockup 2" className="w-full h-auto" />
        </motion.div>

        {/* Top Image */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
          viewport={{ once: false }}
          className="relative w-54 md:w-72 lg:w-70  rounded-2xl overflow-hidden z-20 translate-y-7"
        >
          <img src={images[0]} alt="Mockup 1" className="w-full h-auto" />
        </motion.div>
      </div>
    </HeroHighlight>
  );
}
