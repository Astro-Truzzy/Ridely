// JoinWaitlistSection.tsx
import React from "react";
import WaitlistModal from "./WaitlistModal";
import { FaClipboardList } from "react-icons/fa6";

const JoinWaitlistSection: React.FC = () => {
  const [isModalOpen, setModalOpen] = React.useState(false);

  return (
    <section className="bg-gray-200 py-16 px-4 text-center" id="Waitlist">
      <h2 className="text-4xl font-bold text-[#175aff] mb-4">
        Join Our Waitlist <FaClipboardList className="inline-block translate-y-[-0.5rem]" />
      </h2>
      <p className="text-gray-600 mb-8">
        Be the first to experience Ridely. Whether you're a customer or a rider,
        we're excited to have you on board!
      </p>
      <button
        onClick={() => setModalOpen(true)}
        className="bg-[#175aff] text-white px-6 py-3 rounded-2xl hover:bg-blue-500 transition duration-300"
      >
        Join Now
      </button>

      <WaitlistModal show={isModalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
};

export default JoinWaitlistSection;
