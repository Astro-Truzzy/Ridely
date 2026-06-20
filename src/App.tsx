import { lazy, Suspense, useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Hero from "./Components/HeroSection/Hero";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./App.css";
import WaitlistModal from "./Components/WaitlistModal";
import Footer from "./Components/Footer";
import ScrollToTop from "./Components/MoveToTop/ScrollToTop";
import { Helmet } from "react-helmet";
import CookieNotice from "./Components/CookieNotice";
import StickySignupBar from "./Components/StickySignupBar";
import LazyMount from "./Components/LazyMount";
import PageLoader from "./Components/PageLoader";
import { usePageVisit } from "./hooks/usePageVisit";

const StatsBar = lazy(() => import("./Components/StatsBar"));
const Process = lazy(() => import("./Components/Process/Process"));
const HeroHighlightDemo = lazy(() => import("./Components/hero-highlight-demo"));
const PrioritySec = lazy(() => import("./Components/PrioritySec"));
const Testimonials = lazy(() => import("./Components/Testimonials"));
const GlobeDemo = lazy(() =>
  import("./Components/UI/globe-demo").then((m) => ({ default: m.GlobeDemo }))
);
const BlogSection = lazy(() => import("./Components/BlogSection"));
const TimelineDemo = lazy(() =>
  import("./Components/UI/timeline-demo").then((m) => ({
    default: m.TimelineDemo,
  }))
);
const JoinWaitlistSection = lazy(() => import("./Components/JoinWaitlistSection"));
const FaqSection = lazy(() => import("./Components/FaqSection"));
const ContactCTA = lazy(() => import("./Components/ContactCTA"));
const BlogDetail = lazy(() => import("./Components/BlogDetail"));
const PrivacyPolicy = lazy(() => import("./Components/PrivacyPolicy"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));

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
        <link rel="canonical" href="https://www.ridelyweb.com/" />
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
              <Suspense fallback={null}>
                <StatsBar />
              </Suspense>
              <LazyMount rootMargin="250px">
                <Suspense fallback={null}>
                  <Process />
                  <HeroHighlightDemo />
                  <PrioritySec />
                  <Testimonials />
                </Suspense>
              </LazyMount>
              <LazyMount minHeight="40rem" rootMargin="400px">
                <Suspense fallback={null}>
                  <GlobeDemo />
                </Suspense>
              </LazyMount>
              <LazyMount rootMargin="250px">
                <Suspense fallback={null}>
                  <BlogSection />
                  <TimelineDemo />
                  <JoinWaitlistSection onOpenModal={openModal} />
                  <FaqSection />
                  <ContactCTA />
                  <Footer />
                  <CookieNotice />
                </Suspense>
              </LazyMount>
            </>
          }
        />
        <Route
          path="/blog/:id"
          element={
            <Suspense fallback={<PageLoader />}>
              <BlogDetail />
            </Suspense>
          }
        />
        <Route
          path="/privacy-policy"
          element={
            <Suspense fallback={<PageLoader />}>
              <PrivacyPolicy />
            </Suspense>
          }
        />
      </Routes>
    </div>
  );
}

function App() {
  useEffect(() => {
    const initAos = async () => {
      const [{ default: AOS }] = await Promise.all([
        import("aos"),
        import("aos/dist/aos.css"),
      ]);

      AOS.init({
        duration: 700,
        easing: "ease-in-sine",
        delay: 100,
        offset: 100,
      });
    };

    const schedule = () => {
      void initAos();
    };

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(schedule);
    } else {
      setTimeout(schedule, 1);
    }
  }, []);

  return (
    <Routes>
      <Route
        path="/admin/login"
        element={
          <Suspense fallback={<PageLoader />}>
            <AdminLogin />
          </Suspense>
        }
      />
      <Route
        path="/admin"
        element={
          <Suspense fallback={<PageLoader />}>
            <AdminDashboard />
          </Suspense>
        }
      />
      <Route path="/*" element={<MarketingSite />} />
    </Routes>
  );
}

export default App;
