import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
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
import Footer from "./Components/Footer";
import ContactCTA from "./Components/ContactCTA";
import ScrollToTop from "./Components/MoveToTop/ScrollToTop";
import BlogSection from "./Components/BlogSection";
import { TimelineDemo } from "./Components/UI/timeline-demo";
import BlogDetail from "./Components/BlogDetail";
import { Helmet } from "react-helmet";
import { GlobeDemo } from "./Components/UI/globe-demo";
import PrivacyPolicy from "./Components/PrivacyPolicy";
import CookieNotice from "./Components/CookieNotice";

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
      <Helmet>
        <title>Ridely – Fast, Reliable, and Trackable Package Delivery</title>
        <meta
          name="description"
          content="Ridely helps you send and receive parcels easily with real-time rider tracking, affordable rates, and low-risk delivery."
        />
        <link rel="canonical" href="https://www.ridelyapp.vercel.app/" />
      </Helmet>
      <Navbar />
      <ScrollToTop />
      <WaitlistModal show={modalOpen} onClose={() => setModalOpen(false)} />

      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <>
              <Hero />
              <BackgroundBoxesDemo />
              <Process />
              <HeroHighlightDemo />
              <PrioritySec />
              <GlobeDemo/>
              <BlogSection />
              <TimelineDemo />
              <JoinWaitlistSection />
              <FaqSection />
              <ContactCTA />
              <Footer />
              <CookieNotice/>
            </>
          }
        />
        {/* Blog Detail Page */}
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </div>
  );
}

export default App;
