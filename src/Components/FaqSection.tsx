"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBox,
  FaMapMarkedAlt,
  FaMotorcycle,
  FaUserShield,
  FaCreditCard,
  FaClock,
  FaSmile,
} from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

const faqs = [
  {
    question: "What kind of packages can I send with Ridely?",
    answer:
      "Ridely handles a wide range of items — from documents and small envelopes to medium-sized boxes including food, cosmetics, clothing, and vehicle parts. Prohibited items include live animals, hazardous materials, and illegal goods.",
    icon: <FaBox className="text-xl" style={{ color: "#175aff" }} />,
  },
  {
    question: "Can I track my delivery in real-time?",
    answer:
      "Yes. Every delivery includes live GPS tracking so you can follow your package from pickup to drop-off directly in the Ridely app.",
    icon: <FaMapMarkedAlt className="text-xl" style={{ color: "#175aff" }} />,
  },
  {
    question: "Who delivers my package?",
    answer:
      "Your package is handled by verified Ridely riders — trained professionals committed to safe, reliable, and timely deliveries across the city.",
    icon: <FaMotorcycle className="text-xl" style={{ color: "#175aff" }} />,
  },
  {
    question: "Is my package insured?",
    answer:
      "Yes. All shipments are covered under our standard protection policy, giving you peace of mind from pickup through delivery.",
    icon: <FaUserShield className="text-xl" style={{ color: "#175aff" }} />,
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept cash, debit and credit cards, and mobile money payments — giving you flexible, secure options for every delivery.",
    icon: <FaCreditCard className="text-xl" style={{ color: "#175aff" }} />,
  },
  {
    question: "How fast is Ridely?",
    answer:
      "Most intra-city deliveries are completed within 30 minutes, depending on distance and traffic conditions in your area.",
    icon: <FaClock className="text-xl" style={{ color: "#175aff" }} />,
  },
  {
    question: "Why choose Ridely?",
    answer:
      "Ridely combines smart technology, real-time tracking, and verified riders to deliver packages swiftly and securely. Whether you're a business or an individual, our platform offers convenience, transparency, and reliability at every step.",
    icon: <FaSmile className="text-xl" style={{ color: "#175aff" }} />,
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div
      className="w-full py-20 px-4 md:px-8"
      style={{ background: "#111118" }}
    >
      <section className="max-w-3xl mx-auto" id="FAQs">
        <h2 className="text-3xl md:text-5xl font-extrabold text-center mb-4 text-white">
          Frequently Asked Questions
        </h2>
        <p
          className="text-center mb-12 text-lg"
          style={{ color: "#a0a0b0" }}
        >
          Everything you need to know about Ridely deliveries.
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="rounded-xl overflow-hidden transition-all duration-300"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                backdropFilter: "blur(8px)",
              }}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-5 text-left gap-4"
              >
                <div className="flex gap-3 items-center text-white font-semibold text-base md:text-lg">
                  {faq.icon}
                  <span>{faq.question}</span>
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="flex-shrink-0"
                >
                  <IoIosArrowDown
                    className="text-2xl"
                    style={{ color: "#175aff" }}
                  />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.25 }}
                    className="px-5 pb-5 leading-relaxed"
                    style={{ color: "#a0a0b0" }}
                  >
                    {faq.answer}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
