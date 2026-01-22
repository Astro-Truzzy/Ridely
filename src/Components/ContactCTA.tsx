import { motion } from "framer-motion";
import { HiMail } from "react-icons/hi";

export default function ContactCTA() {
  return (
    <section className="bg-gray-300 py-12 px-6 text-center" id="Contact">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
          Got Questions or Feedback?
        </h2>
        <p className="text-gray-600 text-md md:text-lg mb-6">
          We’d love to hear from you! If you have any inquiries or suggestions,
          simply click the button below to shoot us an email.
        </p>
        <motion.a
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          href="mailto:Ridely.inc@gmail.com"
          className="inline-flex items-center gap-2 bg-[#175aff] text-white px-6 py-3 rounded-full shadow-md hover:bg-[#0f49d1] transition-all duration-300"
        >
          <HiMail className="w-5 h-5" />
          Send us an Email
        </motion.a>
      </div>
    </section>
  );
}
