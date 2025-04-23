// PrioritySection.jsx
import priorityImage from "../assets/Illustrations/PriorityCustomer.png"; // adjust path as needed
import { IoMdPin } from "react-icons/io";
import { FaDoorOpen } from "react-icons/fa6";


const PrioritySec = () => {
  return (
    <section className="w-full py-12 px-6 md:px-16 bg-white text-black pb-[3rem] pt-[8rem]">
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-12">
        {/* Image */}
        <div className="flex justify-center">
          <img
            src={priorityImage}
            alt="Your Package, Our Priority"
            className="w-full max-w-lg h-auto rounded-2xl object-contain"
          />
        </div>

        {/* Text Content */}
        <div className="space-y-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
            Your Package
            <br />
            <span className="text-[#175aff]">Our Priority.</span>
          </h2>

          <p className="text-gray-600 max-w-xl">
            Whether you need to deliver a small package or deliver in bulk,
            Ridely is here to make the process seamless.
          </p>

          {/* Features */}
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="p-3 bg-blue-100 rounded-lg text-2xl text-red-600">
                {" "}
                <IoMdPin />
               </div>
              <div>
                <h4 className="text-lg font-semibold text-[#175aff]">
                  Real Time Tracking
                </h4>
                <p className="text-sm text-gray-600">
                  Track your order from anywhere using our APIs and
                  Geolocations.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="p-3 bg-purple-200 rounded-lg text-2xl"> <FaDoorOpen/> </div>
              <div>
                <h4 className="text-lg font-semibold text-[#175aff]">
                  Doorstep Delivery
                </h4>
                <p className="text-sm text-gray-600">
                  Experience the convenience of having your parcel delivered
                  right to your doorstep with ease and efficiency.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PrioritySec;
