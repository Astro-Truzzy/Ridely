"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon as XIcon } from "@heroicons/react/24/outline";
import ThankYouPopup from "./ThankYouPopup";
import { RiEBike2Fill } from "react-icons/ri";
import { FaPerson } from "react-icons/fa6";
import { submitWaitlistSignup } from "../Lib/waitlist";

export default function WaitlistModal({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) {
  const [role, setRole] = useState<"customer" | "rider" | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    city: "",
    sex: "",
    age: "",
    phone: "",
  });

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    if (showPopup) {
      const timeout = setTimeout(() => {
        setShowPopup(false);
        onClose();
        window.location.href = "/";
      }, 5000);
      return () => clearTimeout(timeout);
    }
  }, [showPopup, onClose]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email address";
    }
    if (!formData.city.trim()) newErrors.city = "City is required";

    if (role === "customer") {
      if (!formData.sex) newErrors.sex = "Sex is required";
    } else if (role === "rider") {
      if (!formData.age.trim()) newErrors.age = "Age is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!role || !validate()) return;

    setSubmitError("");
    setIsSubmitting(true);

    const result = await submitWaitlistSignup({
      role,
      name: formData.name.trim(),
      email: formData.email.trim(),
      city: formData.city.trim(),
      ...(role === "customer"
        ? { sex: formData.sex }
        : { age: formData.age, phone: formData.phone.trim() }),
    });

    setIsSubmitting(false);

    if ("error" in result) {
      setSubmitError(result.error);
      return;
    }

    setShowPopup(true);
  };

  const modalVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 100 },
  };

  const labelClass = "block text-sm font-medium text-[#a0a0b0] mb-1.5";
  const inputClass =
    "w-full bg-[#1a1a2e] border border-white/[0.08] text-white placeholder:text-[#a0a0b0] px-3 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175aff] focus:border-transparent transition-shadow text-base";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          <motion.div className="bg-[#111118] border border-white/[0.08] backdrop-blur-xl p-6 sm:p-8 rounded-2xl w-full max-w-md shadow-2xl shadow-black/50 relative max-h-[90vh] overflow-y-auto">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-lg text-[#a0a0b0] hover:text-white hover:bg-white/[0.06] transition-colors"
              title="Close"
              aria-label="Close"
            >
              <XIcon className="h-5 w-5" />
            </button>

            {showPopup && <ThankYouPopup show={showPopup} onClose={onClose} />}

            {!role && !showPopup && (
              <>
                <h2 className="text-xl sm:text-2xl font-bold text-center text-white mb-2 pr-8">
                  Join the Ridely Waitlist
                </h2>
                <p className="text-[#a0a0b0] text-sm sm:text-base mb-6 text-center">
                  How would you like to use Ridely?
                </p>

                <div className="flex flex-col gap-3 sm:gap-4">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="glass-card w-full p-4 sm:p-5 rounded-xl text-left border border-white/[0.08] hover:border-[#175aff]/40 hover:shadow-[0_0_24px_rgba(23,90,255,0.15)] transition-all duration-300 group"
                    onClick={() => setRole("customer")}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#175aff]/15 text-[#175aff] group-hover:bg-[#175aff]/25 transition-colors">
                        <FaPerson className="w-5 h-5" />
                      </span>
                      <div>
                        <span className="block text-white font-semibold">
                          I need deliveries
                        </span>
                        <span className="block text-sm text-[#a0a0b0] mt-0.5">
                          Get fast, reliable delivery in your city
                        </span>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    className="glass-card w-full p-4 sm:p-5 rounded-xl text-left border border-white/[0.08] hover:border-[#175aff]/40 hover:shadow-[0_0_24px_rgba(23,90,255,0.15)] transition-all duration-300 group"
                    onClick={() => setRole("rider")}
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#175aff]/15 text-[#175aff] group-hover:bg-[#175aff]/25 transition-colors">
                        <RiEBike2Fill className="w-5 h-5" />
                      </span>
                      <div>
                        <span className="block text-white font-semibold">
                          I want to earn as a rider
                        </span>
                        <span className="block text-sm text-[#a0a0b0] mt-0.5">
                          Join our fleet and start earning on your schedule
                        </span>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </>
            )}

            {role && !showPopup && (
              <form onSubmit={handleSubmit} className="space-y-4 mt-1 pr-6">
                <div>
                  <h3 className="text-lg sm:text-xl font-semibold text-white">
                    {role === "customer"
                      ? "Customer details"
                      : "Rider details"}
                  </h3>
                  <p className="text-sm text-[#a0a0b0] mt-1">
                    {role === "customer"
                      ? "Tell us a bit about yourself to secure your spot."
                      : "We'll reach out when rider spots open in your area."}
                  </p>
                </div>

                <div>
                  <label htmlFor="name" className={labelClass}>
                    Full name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Enter your full name"
                    className={inputClass}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  {errors.name && (
                    <p className="text-red-400 text-xs mt-1">{errors.name}</p>
                  )}
                </div>

                {role === "customer" ? (
                  <div>
                    <label htmlFor="sex" className={labelClass}>
                      Sex
                    </label>
                    <select
                      id="sex"
                      className={`${inputClass} appearance-none cursor-pointer`}
                      defaultValue=""
                      onChange={(e) =>
                        setFormData({ ...formData, sex: e.target.value })
                      }
                    >
                      <option value="" disabled className="bg-[#1a1a2e] text-[#a0a0b0]">
                        Select sex
                      </option>
                      <option value="male" className="bg-[#1a1a2e] text-white">
                        Male
                      </option>
                      <option value="female" className="bg-[#1a1a2e] text-white">
                        Female
                      </option>
                    </select>
                    {errors.sex && (
                      <p className="text-red-400 text-xs mt-1">{errors.sex}</p>
                    )}
                  </div>
                ) : (
                  <>
                    <div>
                      <label htmlFor="age" className={labelClass}>
                        Age
                      </label>
                      <input
                        id="age"
                        type="number"
                        placeholder="Your age"
                        min={18}
                        className={inputClass}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                      />
                      {errors.age && (
                        <p className="text-red-400 text-xs mt-1">{errors.age}</p>
                      )}
                    </div>
                    <div>
                      <label htmlFor="phone" className={labelClass}>
                        WhatsApp number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        placeholder="+234 800 000 0000"
                        className={inputClass}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                      {errors.phone && (
                        <p className="text-red-400 text-xs mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <label htmlFor="email" className={labelClass}>
                    Email address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    className={inputClass}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  {errors.email && (
                    <p className="text-red-400 text-xs mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="city" className={labelClass}>
                    City
                  </label>
                  <input
                    id="city"
                    type="text"
                    placeholder="Where are you based?"
                    className={inputClass}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                  {errors.city && (
                    <p className="text-red-400 text-xs mt-1">{errors.city}</p>
                  )}
                </div>

                {submitError && (
                  <p className="text-red-400 text-sm text-center">{submitError}</p>
                )}

                <div className="flex flex-col-reverse sm:flex-row sm:justify-between sm:items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setRole(null)}
                    disabled={isSubmitting}
                    className="text-sm text-[#a0a0b0] hover:text-white transition-colors text-center sm:text-left disabled:opacity-50"
                  >
                    ← Go back
                  </button>
                  <motion.button
                    whileTap={{ scale: isSubmitting ? 1 : 0.97 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="gradient-blue w-full sm:w-auto py-2.5 px-6 rounded-lg font-semibold text-sm sm:text-base disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Joining…" : "Join waitlist"}
                  </motion.button>
                </div>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
