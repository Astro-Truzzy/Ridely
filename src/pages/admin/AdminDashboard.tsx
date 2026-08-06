import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Menu } from "lucide-react";
import { Toaster } from "react-hot-toast";
import {
  clearAdminToken,
  fetchAppMetrics,
  fetchDashboardStats,
  fetchPendingRiderVerifications,
  fetchWaitlistSignups,
  getAdminToken,
  type AppMetrics,
  type DashboardStats,
  type RiderVerificationApplication,
  type WaitlistSignup,
} from "../../Lib/admin";
import ridelyLogo from "../../assets/brand";
import Sidebar from "./components/Sidebar";
import { buildNav, type SectionId } from "./nav";
import { prefersReducedMotion } from "./format";
import Overview from "./sections/Overview";
import Users from "./sections/Users";
import Deliveries from "./sections/Deliveries";
import Finance from "./sections/Finance";
import Verification from "./sections/Verification";
import Traffic from "./sections/Traffic";

const SECTION_TITLES: Record<SectionId, string> = {
  overview: "Overview",
  users: "Users",
  deliveries: "Deliveries",
  finance: "Finance",
  verification: "Verification",
  traffic: "Traffic",
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const reducedMotion = prefersReducedMotion();

  const [active, setActive] = useState<SectionId>("overview");
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [metrics, setMetrics] = useState<AppMetrics | null>(null);
  const [signups, setSignups] = useState<WaitlistSignup[]>([]);
  const [applications, setApplications] = useState<
    RiderVerificationApplication[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const goToLogin = useCallback(() => {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  }, [navigate]);

  const loadData = useCallback(async () => {
    setRefreshing(true);
    setError("");
    try {
      const [statsData, metricsData, waitlistData, verificationData] =
        await Promise.all([
          fetchDashboardStats(),
          fetchAppMetrics(),
          fetchWaitlistSignups({}),
          fetchPendingRiderVerifications(),
        ]);
      setStats(statsData);
      setMetrics(metricsData);
      setSignups(waitlistData.signups);
      setApplications(verificationData.applications);
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") {
        goToLogin();
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [goToLogin]);

  useEffect(() => {
    if (!getAdminToken()) {
      navigate("/admin/login", { replace: true });
      return;
    }
    loadData();
  }, [loadData, navigate]);

  const nav = buildNav(applications.length);

  if (loading && !stats && !metrics) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0a0a0f" }}
      >
        <p className="text-[#a0a0b0]">Loading dashboard…</p>
      </div>
    );
  }

  const renderSection = () => {
    switch (active) {
      case "overview":
        return <Overview stats={stats} metrics={metrics} />;
      case "users":
        return (
          <Users metrics={metrics} signups={signups} onAuthError={goToLogin} />
        );
      case "deliveries":
        return <Deliveries metrics={metrics} />;
      case "finance":
        return <Finance metrics={metrics} onAuthError={goToLogin} />;
      case "verification":
        return (
          <Verification
            applications={applications}
            onReviewed={(riderId) =>
              setApplications((prev) => prev.filter((a) => a.id !== riderId))
            }
            onAuthError={goToLogin}
          />
        );
      case "traffic":
        return <Traffic stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0f" }}>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: "#1a1a2e",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.08)",
          },
        }}
      />
      <Sidebar
        nav={nav}
        active={active}
        onSelect={setActive}
        collapsed={collapsed}
        onToggleCollapse={() => setCollapsed((c) => !c)}
        onRefresh={loadData}
        onLogout={goToLogin}
        refreshing={refreshing}
        mobileOpen={mobileOpen}
        onCloseMobile={() => setMobileOpen(false)}
      />

      {/* Content column — offset by the desktop rail width */}
      <div
        className={`transition-[padding] duration-300 ${
          collapsed ? "lg:pl-[76px]" : "lg:pl-[240px]"
        }`}
      >
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-white/[0.08] bg-[#0a0a0f]/80 backdrop-blur px-4 sm:px-6 h-16">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-1.5 -ml-1 text-[#a0a0b0] hover:text-white rounded-lg"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <img src={ridelyLogo} alt="Ridely" className="h-7 lg:hidden" />
          <h1 className="text-white font-semibold text-lg hidden lg:block">
            {SECTION_TITLES[active]}
          </h1>
          {refreshing && (
            <span className="ml-auto text-xs text-[#a0a0b0]">Refreshing…</span>
          )}
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {error && (
            <p className="text-red-400 text-sm text-center mb-6">{error}</p>
          )}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={reducedMotion ? {} : { opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reducedMotion ? {} : { opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {renderSection()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
