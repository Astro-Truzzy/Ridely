import  { useEffect, useState } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Hero from "./Components/HeroSection/Hero";
import AOS from "aos";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Process from "./Components/Process/Process";
import "./App.css";
import BackgroundBoxesDemo from "./Components/background-boxes-demo";
import HeroHighlightDemo from "./Components/hero-highlight-demo";
import PrioritySec from "./Components/PrioritySec";
import FaqSection from "./Components/FaqSection";
import WaitlistModal from "./Components/WaitlistModal";
import JoinWaitlistSection from "./Components/JoinWaitlistSection";


AOS.init();
function App() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-in-sine",
      delay: 100,
      offset: 100,
    });
    AOS.refresh();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);
  return (
    <div className="overflow-clip bg-gray-300 h-full pt-20">
      <Navbar/>
      <Hero />
      <BackgroundBoxesDemo />
      <Process />
      <HeroHighlightDemo />
      <PrioritySec />
      <WaitlistModal show={modalOpen} onClose={() => setModalOpen(false)} />
        <JoinWaitlistSection/>
      <FaqSection />
    </div>
  );
}

export default App