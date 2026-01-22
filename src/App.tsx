import { useEffect, useState, lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Helmet } from "react-helmet";
import Navbar from "./Components/Navbar/Navbar";
import AOS from "aos";
import "aos/dist/aos.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import ScrollToTop from "./Components/MoveToTop/ScrollToTop";
import WaitlistModal from "./Components/WaitlistModal";

// Lazy load components for code splitting
const Hero = lazy(() => import("./Components/HeroSection/Hero"));
const Process = lazy(() => import("./Components/Process/Process"));
const BackgroundBoxesDemo = lazy(() => import("./Components/background-boxes-demo"));
const HeroHighlightDemo = lazy(() => import("./Components/hero-highlight-demo"));
const PrioritySec = lazy(() => import("./Components/PrioritySec"));
const FaqSection = lazy(() => import("./Components/FaqSection"));
const JoinWaitlistSection = lazy(() => import("./Components/JoinWaitlistSection"));
const Footer = lazy(() => import("./Components/Footer"));
const ContactCTA = lazy(() => import("./Components/ContactCTA"));
const BlogSection = lazy(() => import("./Components/BlogSection"));
const TimelineDemo = lazy(() => 
  import("./Components/UI/timeline-demo").then(module => ({ default: module.TimelineDemo }))
);
const BlogDetail = lazy(() => import("./Components/BlogDetail"));

// Loading fallback component
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-[200px]">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#175AFF]"></div>
  </div>
);

// Component to handle canonical tags for all routes
const CanonicalTag = () => {
  const location = useLocation();
  const siteUrl = "https://ridelyapp.vercel.app";
  
  // Remove trailing slash and ensure clean URL
  const pathname = location.pathname === "/" ? "" : location.pathname.replace(/\/$/, "");
  const canonicalUrl = `${siteUrl}${pathname}`;
  
  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
    </Helmet>
  );
};

function App() {
  useEffect(() => {
    AOS.init({
      duration: 700,
      easing: "ease-in-sine",
      delay: 100,
      offset: 100,
      once: true, // Optimize: animations only once
    });
    AOS.refresh();
  }, []);

  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="overflow-clip bg-gray-300 h-full pt-20">
      <CanonicalTag />
      <Navbar />
      <ScrollToTop />
      <WaitlistModal show={modalOpen} onClose={() => setModalOpen(false)} />

     
      <Routes>
        {/* Home Page */}
        <Route
          path="/"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <Hero />
              <BackgroundBoxesDemo />
              <Process />
              <HeroHighlightDemo />
              <PrioritySec />
              <BlogSection />
              <TimelineDemo />
              <JoinWaitlistSection />
              <FaqSection />
              <ContactCTA />
              <Footer />
            </Suspense>
          }
        />

        {/* Blog Detail Page */}
        <Route 
          path="/blog/:id" 
          element={
            <Suspense fallback={<LoadingFallback />}>
              <BlogDetail />
            </Suspense>
          } 
        />
      </Routes>
    </div>
  );
}

export default App;
