import { TrendingUp } from "lucide-react";
import type { DashboardStats } from "../../../Lib/admin";
import StatCard from "../components/StatCard";
import Section from "../components/Section";
import { formatDay } from "../format";

export default function Traffic({ stats }: { stats: DashboardStats | null }) {
  const maxVisits = Math.max(
    ...(stats?.visits.perDay.map((d) => d.visits) ?? [1]),
    1,
  );

  return (
    <div className="space-y-8">
      <Section
        title="Site traffic"
        subtitle="Marketing-site visits from ridelyweb.com"
        icon={<TrendingUp className="w-5 h-5" />}
      >
        {stats ? (
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
        ) : (
          <p className="text-[#a0a0b0] text-sm">Loading site stats…</p>
        )}
      </Section>

      <div className="grid lg:grid-cols-2 gap-6">
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">Visits — last 7 days</h3>
          {stats ? (
            <div className="flex items-end gap-2 h-40">
              {stats.visits.perDay.map((day) => (
                <div
                  key={day.date}
                  className="flex-1 flex flex-col items-center gap-1"
                >
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
          ) : (
            <p className="text-[#a0a0b0] text-sm">Loading chart…</p>
          )}
        </div>

        <div className="glass-card rounded-xl p-5">
          <h3 className="text-white font-medium mb-4">Waitlist overview</h3>
          {stats ? (
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
          ) : (
            <p className="text-[#a0a0b0] text-sm">Loading waitlist stats…</p>
          )}
        </div>
      </div>
    </div>
  );
}
