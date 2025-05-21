import priorityImage from "../assets/Illustrations/PriorityCustomer.png";
import { IoMdPin } from "react-icons/io";
import { FaDoorOpen, FaMoneyCheckAlt, FaBoxes } from "react-icons/fa";
import { MdSecurity } from "react-icons/md";
import { motion } from "framer-motion";

const featureData = [
  {
    icon: <IoMdPin />,
    bg: "bg-blue-100",
    color: "text-red-600",
    title: "Real Time Tracking",
    desc: "Track your order from anywhere using our APIs and Geolocations.",
  },
  {
    icon: <FaDoorOpen />,
    bg: "bg-purple-200",
    color: "",
    title: "Doorstep Delivery",
    desc: "Experience the convenience of having your parcel delivered right to your doorstep.",
  },
  {
    icon: <MdSecurity />,
    bg: "bg-yellow-100",
    color: "text-green-600",
    title: "Package Insurance",
    desc: "Your parcels are covered with protection plans for peace of mind.",
  },
  {
    icon: <FaBoxes />,
    bg: "bg-orange-100",
    color: "text-orange-600",
    title: "Bulk Delivery",
    desc: "Send multiple packages efficiently with our bulk delivery service.",
  },
  {
    icon: <FaMoneyCheckAlt />,
    bg: "bg-green-100",
    color: "text-blue-700",
    title: "Online Payments",
    desc: "Pay seamlessly and securely through multiple online options.",
  },
];

const PrioritySec = () => {
  return (
    <section
      className="w-full py-12 px-6 md:px-16 bg-white text-black pb-[3rem] pt-[8rem]"
      id="Services"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Image */}
        <div className="flex justify-center">
          <motion.img
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            src={priorityImage}
            alt="Your Package, Our Priority"
            className="w-full max-w-lg h-auto rounded-2xl object-contain"
          />
        </div>

        {/* Text Content */}
        <div className="space-y-6">
          <motion.h2
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="text-3xl md:text-4xl font-bold text-gray-900"
          >
            Your Package
            <br />
            <span className="text-[#175aff]">Our Priority.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-gray-600 max-w-xl"
          >
            Whether you need to deliver a small package or deliver in bulk,
            Ridely is here to make the process seamless.
          </motion.p>

          {/* Features */}
          <div className="space-y-6">
            {featureData.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="flex items-start space-x-4"
              >
                <div
                  className={`p-3 ${item.bg} rounded-lg text-2xl ${item.color}`}
                >
                  {item.icon}
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-[#175aff]">
                    {item.title}
                  </h4>
                  <p className="text-sm text-gray-600">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrioritySec;
