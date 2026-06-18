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
import StatsBar from "./Components/StatsBar";
import HeroHighlightDemo from "./Components/hero-highlight-demo";
import PrioritySec from "./Components/PrioritySec";
import Testimonials from "./Components/Testimonials";
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
import StickySignupBar from "./Components/StickySignupBar";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import { usePageVisit } from "./hooks/usePageVisit";

AOS.init();

function MarketingSite() {
  usePageVisit();

  const [modalOpen, setModalOpen] = useState(false);
  const openModal = () => setModalOpen(true);

  return (
    <div
      className="overflow-clip h-full pt-20"
      style={{ backgroundColor: "#0a0a0f" }}
    >
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
      <StickySignupBar onOpenModal={openModal} />

      <Routes>
        <Route
          path="/"
          element={
            <>
              <Hero />
              <StatsBar />
              <Process />
              <HeroHighlightDemo />
              <PrioritySec />
              <Testimonials />
              <GlobeDemo />
              <BlogSection />
              <TimelineDemo />
              <JoinWaitlistSection onOpenModal={openModal} />
              <FaqSection />
              <ContactCTA />
              <Footer />
              <CookieNotice />
            </>
          }
        />
        <Route path="/blog/:id" element={<BlogDetail />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
      </Routes>
    </div>
  );
}

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

  return (
    <Routes>
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin" element={<AdminDashboard />} />
      <Route path="/*" element={<MarketingSite />} />
    </Routes>
  );
}

export default App;
