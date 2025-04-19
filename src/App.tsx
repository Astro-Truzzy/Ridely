import  { useEffect } from "react";
import Navbar from "./Components/Navbar/Navbar";
import Hero from "./Components/HeroSection/Hero";
import AOS from "aos";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";
import Banner from "./Components/Banner";
import Process from "./Components/Process/Process";
import "./App.css";
import Mockup from "./Components/Mockup/Mockup";

AOS.init();
function App() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: 'ease-in-sine',
      delay: 100,
      offset: 100,
    });
    AOS.refresh();
  }, []);
  return (
    <div className="overflow-clip h-full pt-[80px]">
      <Navbar />
      <Hero />
      <Banner/>
      <Process/>
      <Mockup/>
      </div>
  )
}

export default App