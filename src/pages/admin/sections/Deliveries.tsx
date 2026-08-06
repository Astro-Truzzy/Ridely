import { Package, MapPin, Bike } from "lucide-react";
import type { AppMetrics } from "../../../Lib/admin";
import StatCard from "../components/StatCard";
import Section from "../components/Section";
import StatusFunnel from "../components/StatusFunnel";
import Hotzones from "../components/Hotzones";
import { PanelUnavailable } from "../components/PanelState";

export default function Deliveries({ metrics }: { metrics: AppMetrics | null }) {
  const overview = metrics?.overview;
  const funnel = metrics?.funnel;
  const deliveryZones = metrics?.hotzones.delivery;
  const riderZones = metrics?.hotzones.rider;

  return (
    <div className="space-y-8">
      <Section
        title="Deliveries"
        subtitle="Volume, status flow and demand hotzones"
        icon={<Package className="w-5 h-5" />}
      >
        {overview?.available ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard label="Total deliveries" value={overview.data.deliveries.total} />
            <StatCard label="Active now" value={overview.data.deliveries.active} />
            <StatCard label="Completed" value={overview.data.deliveries.completed} />
            <StatCard label="Cancelled" value={overview.data.deliveries.cancelled} />
          </div>
        ) : (
          <PanelUnavailable label="Delivery metrics aren’t connected yet." />
        )}
      </Section>

      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-white font-medium">Status funnel</h3>
          {funnel?.available && (
            <span className="text-xs text-[#a0a0b0]">
              {funnel.data.total.toLocaleString()} total ·{" "}
              {funnel.data.completionRate}% completion
            </span>
          )}
        </div>
        {funnel?.available ? (
          <StatusFunnel stages={funnel.data.stages} />
        ) : (
          <PanelUnavailable label="Delivery status data isn’t connected yet." />
        )}
      </div>

      {/* Hotzones */}
      <Section
        title="Hotzones"
        subtitle="Where demand and riders concentrate (grid-cell aggregation)"
        icon={<MapPin className="w-5 h-5" />}
      >
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-[#4d7dff]" />
              <h3 className="text-white font-medium">Delivery pickup hotzones</h3>
            </div>
            {deliveryZones?.available ? (
              <Hotzones zones={deliveryZones.data} />
            ) : (
              <PanelUnavailable label="Pickup location data isn’t connected yet." />
            )}
          </div>

          <div className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <Bike className="w-4 h-4 text-[#34d399]" />
              <h3 className="text-white font-medium">Rider request hotzones</h3>
            </div>
            {riderZones?.available ? (
              <Hotzones zones={riderZones.data} accent="52, 211, 153" />
            ) : (
              <PanelUnavailable label="Rider location data isn’t connected yet." />
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}
