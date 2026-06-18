import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  clearAdminToken,
  fetchDashboardStats,
  fetchWaitlistSignups,
  getAdminToken,
  type DashboardStats,
  type WaitlistSignup,
} from "../../lib/admin";
import ridelyLogo from "../../assets/brand";

function StatCard({
  label,
  value,
  sub,
}: {
  label: string;
  value: number | string;
  sub?: string;
}) {
  return (
    <div className="glass-card rounded-xl p-5">
      <p className="text-[#a0a0b0] text-sm">{label}</p>
      <p className="text-3xl font-bold text-white mt-1">{value}</p>
      {sub && <p className="text-xs text-[#a0a0b0] mt-1">{sub}</p>}
    </div>
  );
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

function formatDay(date: string) {
  return new Date(date + "T12:00:00").toLocaleDateString("en-NG", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [signups, setSignups] = useState<WaitlistSignup[]>([]);
  const [totalSignups, setTotalSignups] = useState(0);
  const [roleFilter, setRoleFilter] = useState<"" | "customer" | "rider">("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [statsData, waitlistData] = await Promise.all([
        fetchDashboardStats(),
        fetchWaitlistSignups({ role: roleFilter || undefined, search: debouncedSearch }),
      ]);
      setStats(statsData);
      setSignups(waitlistData.signups);
      setTotalSignups(waitlistData.total);
    } catch (err) {
      if (err instanceof Error && err.message === "Unauthorized") {
        clearAdminToken();
        navigate("/admin/login", { replace: true });
        return;
      }
      setError(err instanceof Error ? err.message : "Failed to load dashboard");
    } finally {
      setLoading(false);
    }
  }, [navigate, roleFilter, debouncedSearch]);

  useEffect(() => {
    if (!getAdminToken()) {
      navigate("/admin/login", { replace: true });
      return;
    }
    loadData();
  }, [loadData, navigate]);

  const maxVisits = Math.max(...(stats?.visits.perDay.map((d) => d.visits) ?? [1]), 1);

  const handleLogout = () => {
    clearAdminToken();
    navigate("/admin/login", { replace: true });
  };

  if (loading && !stats) {
    return (
      <div
        className="min-h-screen flex items-center justify-center"
        style={{ background: "#0a0a0f" }}
      >
        <p className="text-[#a0a0b0]">Loading dashboard…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0f" }}>
      <header className="border-b border-white/[0.08] px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={ridelyLogo} alt="Ridely" className="h-8" />
          <span className="text-white font-semibold">Admin</span>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="text-sm text-[#a0a0b0] hover:text-white transition-colors"
          >
            Refresh
          </button>
          <button
            onClick={handleLogout}
            className="text-sm text-[#a0a0b0] hover:text-white transition-colors"
          >
            Log out
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {error && (
          <p className="text-red-400 text-sm text-center">{error}</p>
        )}

        {stats && (
          <>
            <section>
              <h2 className="text-lg font-semibold text-white mb-4">Site visits</h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard label="Total visits" value={stats.visits.total} />
                <StatCard
                  label="Today"
                  value={stats.visits.today}
                  sub={`${stats.visits.uniqueToday} unique`}
                />
                <StatCard
                  label="This week"
                  value={stats.visits.thisWeek}
                  sub={`${stats.visits.uniqueThisWeek} unique`}
                />
                <StatCard
                  label="Top page"
                  value={stats.visits.topPages[0]?.path ?? "—"}
                  sub={
                    stats.visits.topPages[0]
                      ? `${stats.visits.topPages[0].count} views`
                      : undefined
                  }
                />
              </div>
            </section>

            <section className="grid lg:grid-cols-2 gap-6">
              <div className="glass-card rounded-xl p-5">
                <h3 className="text-white font-medium mb-4">Visits — last 7 days</h3>
                <div className="flex items-end gap-2 h-40">
                  {stats.visits.perDay.map((day) => (
                    <div key={day.date} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className="w-full rounded-t bg-[#175aff]/80 min-h-[4px]"
                        style={{
                          height: `${Math.max((day.visits / maxVisits) * 100, 4)}%`,
                        }}
                        title={`${day.visits} visits, ${day.unique} unique`}
                      />
                      <span className="text-[10px] text-[#a0a0b0] text-center leading-tight">
                        {formatDay(day.date)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="glass-card rounded-xl p-5">
                <h3 className="text-white font-medium mb-4">Waitlist overview</h3>
                <div className="grid grid-cols-2 gap-4">
                  <StatCard label="Total signups" value={stats.waitlist.total} />
                  <StatCard
                    label="This week"
                    value={stats.waitlist.thisWeek}
                    sub={`+${stats.waitlist.today} today`}
                  />
                  <StatCard label="Customers" value={stats.waitlist.customers} />
                  <StatCard label="Riders" value={stats.waitlist.riders} />
                </div>
              </div>
            </section>
          </>
        )}

        <section>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-white">
              Waitlist signups
              <span className="text-[#a0a0b0] text-sm font-normal ml-2">
                ({totalSignups})
              </span>
            </h2>
            <div className="flex gap-2">
              <input
                type="search"
                placeholder="Search name, email, city…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-[#1a1a2e] border border-white/[0.08] text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175aff] w-full sm:w-56"
              />
              <select
                value={roleFilter}
                onChange={(e) =>
                  setRoleFilter(e.target.value as "" | "customer" | "rider")
                }
                className="bg-[#1a1a2e] border border-white/[0.08] text-white text-sm px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#175aff]"
              >
                <option value="">All roles</option>
                <option value="customer">Customers</option>
                <option value="rider">Riders</option>
              </select>
            </div>
          </div>

          <div className="glass-card rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/[0.08] text-[#a0a0b0] text-left">
                    <th className="px-4 py-3 font-medium">Name</th>
                    <th className="px-4 py-3 font-medium">Email</th>
                    <th className="px-4 py-3 font-medium">Role</th>
                    <th className="px-4 py-3 font-medium">City</th>
                    <th className="px-4 py-3 font-medium">Details</th>
                    <th className="px-4 py-3 font-medium">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {signups.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-8 text-center text-[#a0a0b0]">
                        No signups yet
                      </td>
                    </tr>
                  ) : (
                    signups.map((s) => (
                      <tr
                        key={s.id}
                        className="border-b border-white/[0.04] hover:bg-white/[0.02]"
                      >
                        <td className="px-4 py-3 text-white">{s.name}</td>
                        <td className="px-4 py-3 text-[#a0a0b0]">{s.email}</td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                              s.role === "rider"
                                ? "bg-[#175aff]/20 text-[#4d7dff]"
                                : "bg-purple-500/20 text-purple-300"
                            }`}
                          >
                            {s.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[#a0a0b0]">{s.city}</td>
                        <td className="px-4 py-3 text-[#a0a0b0]">
                          {s.role === "customer"
                            ? s.sex
                            : `Age ${s.age}${s.phone ? ` · ${s.phone}` : ""}`}
                        </td>
                        <td className="px-4 py-3 text-[#a0a0b0] whitespace-nowrap">
                          {formatDate(s.created_at)}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
