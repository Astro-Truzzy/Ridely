import { Users, Package, Wallet, TrendingUp, CheckCircle2, XCircle, Clock } from "lucide-react";
import type { AppMetrics, DashboardStats } from "../../../Lib/admin";
import StatCard from "../components/StatCard";
import Section from "../components/Section";
import BarChart from "../components/BarChart";
import StatusFunnel from "../components/StatusFunnel";
import ActivityFeed from "../components/ActivityFeed";
import { PanelUnavailable } from "../components/PanelState";
import { formatNaira } from "../format";

export default function Overview({
  stats,
  metrics,
}: {
  stats: DashboardStats | null;
  metrics: AppMetrics | null;
}) {
  const overview = metrics?.overview;
  const earningsDay = metrics?.earnings.day;
  const funnel = metrics?.funnel;
  const activity = metrics?.activity;

  return (
    <div className="space-y-8">
      {/* Users + deliveries KPI row */}
      <Section
        title="At a glance"
        subtitle="Live totals across the Ridely platform"
        icon={<TrendingUp className="w-5 h-5" />}
      >
        {overview?.available ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Total users"
              value={overview.data.users.total}
              sub={`${overview.data.users.customers} customers · ${overview.data.users.riders} riders`}
              icon={<Users className="w-6 h-6" />}
            />
            <StatCard
              label="Deliveries"
              value={overview.data.deliveries.total}
              sub={`${overview.data.deliveries.today} today · ${overview.data.deliveries.thisWeek} this week`}
              icon={<Package className="w-6 h-6" />}
            />
            <StatCard
              label="Rider earnings"
              value={overview.data.revenue.riderEarnings}
              format="naira"
              sub={`${formatNaira(overview.data.revenue.commission)} platform commission`}
              icon={<TrendingUp className="w-6 h-6" />}
            />
            <StatCard
              label="Wallet float"
              value={overview.data.revenue.walletFloat}
              format="naira"
              sub="Held across user wallets"
              icon={<Wallet className="w-6 h-6" />}
            />
          </div>
        ) : (
          <PanelUnavailable label="Platform metrics aren’t connected yet." />
        )}
      </Section>

      {/* New signups + delivery state */}
      {overview?.available && (
        <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          <StatCard
            label="New today"
            value={overview.data.users.newToday}
            sub="riders + customers"
          />
          <StatCard
            label="New this week"
            value={overview.data.users.newThisWeek}
            sub="riders + customers"
          />
          <StatCard label="Active deliveries" value={overview.data.deliveries.active} />
          <StatCard label="Completed" value={overview.data.deliveries.completed} />
          <StatCard label="Cancelled" value={overview.data.deliveries.cancelled} />
        </div>
      )}

      {/* Earnings + funnel */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-white font-medium mb-1">Earnings — last 30 days</h3>
          <p className="text-xs text-[#a0a0b0] mb-4">Gross delivery value per day</p>
          {earningsDay?.available ? (
            <BarChart
              data={earningsDay.data.map((d) => ({
                label: d.period.slice(5),
                value: d.gross,
                title: `${d.period} · ${d.deliveries} deliveries`,
              }))}
              formatValue={formatNaira}
            />
          ) : (
            <PanelUnavailable label="Earnings data isn’t connected yet." />
          )}
        </div>

        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-medium">Delivery funnel</h3>
            {funnel?.available && (
              <span className="text-xs text-[#a0a0b0]">
                {funnel.data.completionRate}% completion
              </span>
            )}
          </div>
          {funnel?.available ? (
            <StatusFunnel stages={funnel.data.stages} />
          ) : (
            <PanelUnavailable label="Delivery data isn’t connected yet." />
          )}
        </div>
      </div>

      {/* Site + waitlist quick stats + activity */}
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">Recent activity</h3>
          {activity?.available ? (
            <ActivityFeed items={activity.data} />
          ) : (
            <PanelUnavailable label="Activity feed isn’t connected yet." />
          )}
        </div>

        <div className="space-y-4">
          {stats && (
            <>
              <div className="flex items-center gap-3 glass-card rounded-xl p-4">
                <Clock className="w-5 h-5 text-[#4d7dff]" />
                <div>
                  <p className="text-2xl font-bold text-white">{stats.visits.today}</p>
                  <p className="text-xs text-[#a0a0b0]">Site visits today</p>
                </div>
              </div>
              <div className="flex items-center gap-3 glass-card rounded-xl p-4">
                <CheckCircle2 className="w-5 h-5 text-[#34d399]" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {stats.waitlist.total}
                  </p>
                  <p className="text-xs text-[#a0a0b0]">Waitlist signups</p>
                </div>
              </div>
              <div className="flex items-center gap-3 glass-card rounded-xl p-4">
                <XCircle className="w-5 h-5 text-[#f5c842]" />
                <div>
                  <p className="text-2xl font-bold text-white">
                    {stats.waitlist.thisWeek}
                  </p>
                  <p className="text-xs text-[#a0a0b0]">Signups this week</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
