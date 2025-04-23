import signup from "../../assets/Images/signup.png";
import bookrider from "../../assets/Images/upscalemedia-transformed (1).png";
import details from "../../assets/Images/package-location-3d-icon-download-in-png-blend-fbx-gltf-file-formats--parcel-delivery-tracking-and-navigation-pack-services-icons-7191762-removebg-preview.png";
import otw from "../../assets/Images/delivered-removebg-preview.png";

const Process = () => {
  return (
    <section className="my-12">
      <div className="container">
        {/* Header section */}
        <h1 className="text-3xl font-bold font-serif text-center mt-32 mb-14">
          <span className="text-[#175AFF]">The</span> Process
        </h1>

        {/* Centered Grid */}
        <div className="flex justify-center">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div
              data-aos="fade-up"
              data-aos-duration="200"
              data-aos-once="false"
              className="w-[300px] h-[310px] bg-gradient-to-br from-blue-200 to-blue-300 transition duration-500 rounded-xl flex items-center justify-center flex-col text-center gap-3 px-[0.5rem] text-white group"
            >
              <img
                src={signup}
                alt="signup"
                className="w-[80px] shadow-2xl transform transition duration-300 group-hover:-translate-y-2 p-1 rounded-2xl"
              />
              <h2 className="font-semibold text-2xl sm:text-[30px]">Sign Up</h2>
              <p>
                Easily create an account in seconds and access a smooth delivery
                experience instantly.
              </p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-duration="400"
              data-aos-once="false"
              className="w-[300px] h-[310px] bg-gradient-to-br from-blue-300 to-blue-400 transition duration-500 rounded-xl flex items-center justify-center flex-col text-center gap-3 px-[0.5rem] text-white group"
            >
              <img
                src={bookrider}
                alt=""
                className="w-[80px] shadow-2xl transform transition duration-300 group-hover:-translate-y-2 rounded-2xl"
              />
              <h2 className="font-semibold text-2xl sm:text-[30px]">
                Book a Rider
              </h2>
              <p>
                Quickly request a nearby dispatch rider with just a few taps on
                the app.
              </p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-duration="600"
              data-aos-once="false"
              className="w-[300px] h-[310px] bg-gradient-to-br from-blue-400 to-blue-500 transition duration-500 hover:bg-blue-400 rounded-xl flex items-center justify-center flex-col  text-center gap-3 px-[0.5rem] text-white group"
            >
              <img
                src={details}
                alt=""
                className="w-[80px] shadow-2xl transform transition duration-300 group-hover:-translate-y-2 p-1 rounded-2xl"
              />
              <h2 className="font-semibold text-2xl sm:text-[30px]">
                Enter details
              </h2>
              <p>
                Fill in pickup and delivery info, choose parcel size, and get
                instant cost estimates.
              </p>
            </div>

            <div
              data-aos="fade-up"
              data-aos-duration="800"
              data-aos-once="false"
              className="w-[300px] h-[310px] bg-gradient-to-br from-blue-500 to-blue-600 transition duration-500 hover:bg-blue-400 rounded-xl flex items-center justify-center flex-col text-center gap-3 px-[0.5rem] text-white group"
            >
              <img
                src={otw}
                alt=""
                className="w-[80px] shadow-2xl transform transition duration-300 group-hover:-translate-y-2 px-1 rounded-2xl"
              />
              <h2 className="font-semibold text-2xl sm:text-[30px]">OTW!</h2>
              <p>
                Track your package in real-time and enjoy timely, secure
                deliveries to your doorstep.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Process;
