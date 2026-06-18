"use client";
import { motion } from "motion/react";
import { FaCheckCircle } from "react-icons/fa";

import LocMock from "../assets/Images/LocMock.png";
import DetMock from "../assets/Images/DetMock.png";
import TracMoc from "../assets/Images/TracMoc.png";

const images = [LocMock, DetMock, TracMoc];

const features = [
  "Live GPS tracking — watch your rider move in real-time",
  "Instant delivery confirmations sent straight to your phone",
  "Manage multiple shipments from one clean dashboard",
  "24/7 support with lightning-fast response times",
];

export default function HeroHighlightDemo() {
  return (
    <section
      style={{
        background: "linear-gradient(180deg, #0a0a0f 0%, #111118 50%, #0a0a0f 100%)",
      }}
      className="w-full py-20 px-6 md:px-12 lg:px-20 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16">
        {/* Left Side */}
        <div className="md:w-1/2 space-y-8">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
              Built for Simplicity.{" "}
              <span style={{ color: "#175aff" }}>Designed for Speed.</span>
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-lg"
            style={{ color: "#a0a0b0" }}
          >
            The Ridely app puts the entire delivery experience in your pocket.
            From booking a pickup to signing off on delivery — it's intuitive,
            fast, and built for Nigerian streets.
          </motion.p>

          {/* Feature bullets */}
          <motion.ul
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
            className="space-y-3"
          >
            {features.map((feat, i) => (
              <motion.li
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 0.35 + i * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start gap-3"
              >
                <FaCheckCircle
                  className="mt-1 flex-shrink-0 text-lg"
                  style={{ color: "#175aff" }}
                />
                <span style={{ color: "#a0a0b0" }}>{feat}</span>
              </motion.li>
            ))}
          </motion.ul>

          <motion.a
            href="#Waitlist"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            viewport={{ once: true }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.97 }}
            className="inline-block font-bold px-8 py-3 rounded-full text-white text-base"
            style={{
              background: "linear-gradient(135deg, #175aff, #4d7dff)",
              boxShadow: "0 0 24px rgba(23,90,255,0.4)",
            }}
          >
            Get Early Access →
          </motion.a>
        </div>

        {/* Right Side — Phone Mockups with blue glow */}
        <div className="md:w-1/2 relative flex justify-center items-center h-[400px] md:h-[520px]">
          {/* Glow behind phones */}
          <div
            className="absolute inset-0 rounded-full pointer-events-none"
            style={{
              background: "radial-gradient(ellipse at center, rgba(23,90,255,0.18) 0%, transparent 70%)",
            }}
          />

          {/* Back Image */}
          <motion.div
            initial={{ opacity: 0, y: 100, rotate: 0 }}
            whileInView={{ opacity: 1, y: 0, rotate: 40 }}
            transition={{ delay: 0.5, duration: 0.8, type: "spring" }}
            viewport={{ once: false }}
            className="absolute z-0 bg-transparent"
            style={{
              width: "240px",
              transform: "translateX(85px) translateY(-35px) rotate(40deg)",
            }}
          >
            <img
              src={images[2]}
              alt="Tracking screen"
              className="w-full h-auto border-0 outline-none"
              draggable={false}
            />
          </motion.div>

          {/* Middle Image */}
          <motion.div
            initial={{ opacity: 0, y: 100, rotate: -10 }}
            whileInView={{ opacity: 1, y: 0, rotate: -40 }}
            transition={{ delay: 0.4, duration: 0.8, type: "spring" }}
            viewport={{ once: false }}
            className="absolute z-10 bg-transparent"
            style={{
              width: "240px",
              transform: "translateX(-85px) translateY(-30px) rotate(-40deg)",
            }}
          >
            <img
              src={images[1]}
              alt="Delivery details"
              className="w-full h-auto border-0 outline-none"
              draggable={false}
            />
          </motion.div>

          {/* Front Image */}
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8, type: "spring" }}
            viewport={{ once: false }}
            className="relative z-20 bg-transparent"
            style={{
              width: "260px",
              transform: "translateY(28px)",
            }}
          >
            <img
              src={images[0]}
              alt="Location screen"
              className="w-full h-auto border-0 outline-none"
              draggable={false}
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
