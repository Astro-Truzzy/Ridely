import { useState } from "react";
import { Wallet, TrendingUp, Percent, Banknote } from "lucide-react";
import type { AppMetrics, EarningsBucket } from "../../../Lib/admin";
import StatCard from "../components/StatCard";
import Section from "../components/Section";
import BarChart from "../components/BarChart";
import Leaderboard from "../components/Leaderboard";
import { PanelUnavailable } from "../components/PanelState";
import { formatNaira, formatCompact } from "../format";

const BUCKETS: { id: EarningsBucket; label: string; window: string }[] = [
  { id: "day", label: "Daily", window: "last 30 days" },
  { id: "week", label: "Weekly", window: "last 12 weeks" },
  { id: "month", label: "Monthly", window: "last 12 months" },
];

export default function Finance({ metrics }: { metrics: AppMetrics | null }) {
  const [bucket, setBucket] = useState<EarningsBucket>("day");
  const overview = metrics?.overview;
  const earnings = metrics?.earnings[bucket];
  const leaderboards = metrics?.leaderboards;
  const activeBucket = BUCKETS.find((b) => b.id === bucket)!;

  return (
    <div className="space-y-8">
      <Section
        title="Finance"
        subtitle="Revenue, commission and rider earnings"
        icon={<Wallet className="w-5 h-5" />}
      >
        {overview?.available ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard
              label="Gross value"
              value={overview.data.revenue.gross}
              format="naira"
              icon={<TrendingUp className="w-6 h-6" />}
            />
            <StatCard
              label="Platform commission"
              value={overview.data.revenue.commission}
              format="naira"
              icon={<Percent className="w-6 h-6" />}
            />
            <StatCard
              label="Rider earnings"
              value={overview.data.revenue.riderEarnings}
              format="naira"
              icon={<Banknote className="w-6 h-6" />}
            />
            <StatCard
              label="Wallet float"
              value={overview.data.revenue.walletFloat}
              format="naira"
              icon={<Wallet className="w-6 h-6" />}
            />
          </div>
        ) : (
          <PanelUnavailable label="Financial metrics aren’t connected yet." />
        )}
      </Section>

      {/* Earnings over time with bucket toggle */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
          <div>
            <h3 className="text-white font-medium">Earnings over time</h3>
            <p className="text-xs text-[#a0a0b0] mt-0.5">
              Gross delivery value · {activeBucket.window}
            </p>
          </div>
          <div className="inline-flex rounded-lg bg-white/[0.03] p-0.5">
            {BUCKETS.map((b) => (
              <button
                key={b.id}
                onClick={() => setBucket(b.id)}
                className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                  bucket === b.id
                    ? "bg-[#175aff] text-white"
                    : "text-[#a0a0b0] hover:text-white"
                }`}
              >
                {b.label}
              </button>
            ))}
          </div>
        </div>
        {earnings?.available ? (
          <BarChart
            data={earnings.data.map((d) => ({
              label: bucket === "month" ? d.period.slice(0, 7) : d.period.slice(5),
              value: d.gross,
              title: `${d.period} · ${formatCompact(d.deliveries)} deliveries · ${formatNaira(
                d.commission,
              )} commission`,
            }))}
            formatValue={formatNaira}
            height={200}
          />
        ) : (
          <PanelUnavailable label="Earnings data isn’t connected yet." />
        )}
      </div>

      {/* Leaderboards */}
      <Section title="Leaderboards" subtitle="Top performers by value">
        {leaderboards?.available ? (
          <div className="grid lg:grid-cols-2 gap-6">
            <Leaderboard
              title="Top riders by earnings"
              rows={leaderboards.data.topRiders.map((r) => ({
                id: r.id,
                name: r.name,
                primary: formatNaira(r.earnings),
                secondary: `${formatCompact(r.deliveries)} deliveries`,
              }))}
            />
            <Leaderboard
              title="Top customers by spend"
              accent="#34d399"
              rows={leaderboards.data.topCustomers.map((c) => ({
                id: c.id,
                name: c.name,
                primary: formatNaira(c.spend),
                secondary: `${formatCompact(c.orders)} orders`,
              }))}
            />
          </div>
        ) : (
          <PanelUnavailable label="Leaderboards aren’t connected yet." />
        )}
      </Section>
    </div>
  );
}
