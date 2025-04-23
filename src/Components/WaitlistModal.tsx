"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XMarkIcon as XIcon } from "@heroicons/react/24/outline";
import ThankYouPopup from "./ThankYouPopup"; // Adjust path if needed

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

  useEffect(() => {
    if (showPopup) {
      const timeout = setTimeout(() => {
        setShowPopup(false);
        onClose();
        window.location.href = "/";
      }, 3000);
      return () => clearTimeout(timeout);
    }
  }, [showPopup, onClose]);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setShowPopup(true);
  };

  const buttonClasses =
    "bg-[#175aff] text-white py-2 px-4 rounded-md hover:scale-105 transition-transform duration-300";

  const modalVariants = {
    hidden: { opacity: 0, y: 100 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 100 },
  };

  const inputStyle = "w-full border p-2 rounded-md focus:outline-none";

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalVariants}
        >
          <motion.div className="bg-white p-6 rounded-lg w-[90%] max-w-md shadow-xl relative">
            <button
              onClick={onClose}
              className="absolute top-2 right-2"
              title="Close"
            >
              <XIcon className="h-6 w-6 text-gray-500 hover:text-black" />
            </button>

            {showPopup && <ThankYouPopup show={showPopup} onClose={onClose} />}

            {!role && !showPopup && (
              <>
                <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
                  Join Our Waitlist
                </h2>
                <p className="text-gray-600 text-sm mb-6 text-center">
                  Choose how you want to join Ridely:
                </p>

                <div className="flex flex-col gap-4">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className={buttonClasses}
                    onClick={() => setRole("customer")}
                  >
                    Register as Customer 👤
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className={buttonClasses}
                    onClick={() => setRole("rider")}
                  >
                    Register as Rider 🛵
                  </motion.button>
                </div>
              </>
            )}

            {role && !showPopup && (
              <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {role === "customer" ? "Customer Info 👤" : "Rider Info 🛵"}
                </h3>

                <div>
                  <input
                    type="text"
                    placeholder="Name"
                    className={inputStyle}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                  />
                  {errors.name && (
                    <p className="text-red-500 text-xs">{errors.name}</p>
                  )}
                </div>

                {role === "customer" ? (
                  <div>
                    <label htmlFor="sex" className="sr-only">
                      Select Sex
                    </label>
                    <select
                      id="sex"
                      className={inputStyle}
                      onChange={(e) =>
                        setFormData({ ...formData, sex: e.target.value })
                      }
                    >
                      <option value="">Select Sex</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                    </select>
                    {errors.sex && (
                      <p className="text-red-500 text-xs">{errors.sex}</p>
                    )}
                  </div>
                ) : (
                  <>
                    <div>
                      <input
                        type="number"
                        placeholder="Age"
                        className={inputStyle}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                      />
                      {errors.age && (
                        <p className="text-red-500 text-xs">{errors.age}</p>
                      )}
                    </div>
                    <div>
                      <input
                        type="tel"
                        placeholder="WhatsApp Phone Number"
                        className={inputStyle}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                      />
                      {errors.phone && (
                        <p className="text-red-500 text-xs">{errors.phone}</p>
                      )}
                    </div>
                  </>
                )}

                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    className={inputStyle}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs">{errors.email}</p>
                  )}
                </div>

                <div>
                  <input
                    type="text"
                    placeholder="City"
                    className={inputStyle}
                    onChange={(e) =>
                      setFormData({ ...formData, city: e.target.value })
                    }
                  />
                  {errors.city && (
                    <p className="text-red-500 text-xs">{errors.city}</p>
                  )}
                </div>

                <div className="flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => setRole(null)}
                    className="text-sm text-gray-500 hover:underline"
                  >
                    ← Go Back
                  </button>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className={buttonClasses}
                  >
                    Submit 🚀
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
