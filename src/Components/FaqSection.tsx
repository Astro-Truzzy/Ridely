"use client";

import { FcFaq } from "react-icons/fc";
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
      "Ridely lets you send anything from small envelopes to medium-sized boxes (food, cosmetic products, clothes, vehicle repair parts, and lots more. ). Just no live animals or time-traveling devices, please 🚫🐸🕰️.",
    icon: <FaBox className="text-blue-600 text-xl" />,
  },
  {
    question: "Can I track my delivery in real-time?",
    answer:
      "Yes! Use our real-time map tracking to watch your package ride from pickup to dropoff📍.",
    icon: <FaMapMarkedAlt className="text-blue-600 text-xl" />,
  },
  {
    question: "Who delivers my package?",
    answer:
      "Ridely riders! Trusted, verified, and trained to ride rain or shine ☀️🌧️.",
    icon: <FaMotorcycle className="text-blue-600 text-xl" />,
  },
  {
    question: "Is my package insured?",
    answer:
      "Absolutely. All packages are covered under our standard protection policy 🔐.",
    icon: <FaUserShield className="text-blue-600 text-xl" />,
  },
  {
    question: "What payment methods do you accept?",
    answer:
      "We accept cash, cards, mobile payments, and the occasional high-five (just kidding 😄).",
    icon: <FaCreditCard className="text-blue-600 text-xl" />,
  },
  {
    question: "How fast is Ridely?",
    answer:
      "Super fast! Most intra-city deliveries are done in under 30 minutes 🚀.",
    icon: <FaClock className="text-blue-600 text-xl" />,
  },
  {
    question: "Why choose Ridely?",
    answer:
      "Ridely combines smart technology, real-time tracking, and reliable riders to deliver packages swiftly and securely. Whether you're a business or individual, our platform ensures convenience, transparency, and peace of mind — every step of the way.📬",
    icon: <FaSmile className="text-blue-600 text-xl" />,
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-800 py-16 px-4 transition-colors duration-200">
      <section className="max-w-5xl mx-auto" id="FAQs">
        <h2 className="text-4xl font-bold text-center mb-10 text-neutral-800 dark:text-white">
          <FcFaq className="inline-block mr-2" />
          Frequently Asked Questions
        </h2>
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className="border border-gray-200 dark:border-gray-700 rounded-lg shadow-md transition-all duration-300 bg-white dark:bg-gray-700"
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-center justify-between p-4 text-left"
              >
                <div className="flex gap-3 items-center text-gray-800 dark:text-gray-200 font-semibold text-lg">
                  {faq.icon} {faq.question}
                </div>
                <motion.div
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ type: "spring", stiffness: 200 }}
                >
                  <IoIosArrowDown className="text-2xl text-gray-500 dark:text-gray-400" />
                </motion.div>
              </button>
              <AnimatePresence initial={false}>
                {openIndex === index && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-4 pb-4 text-gray-600 dark:text-gray-300"
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
