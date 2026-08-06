import { Database } from "lucide-react";

/**
 * Shown when a metric RPC hasn't been applied yet (graceful degradation).
 * Directs the operator to run supabase/admin-dashboard-setup.sql.
 */
export function PanelUnavailable({ label }: { label?: string }) {
  return (
    <div className="glass-card rounded-xl px-4 py-8 text-center">
      <Database className="w-6 h-6 mx-auto text-[#a0a0b0]/50 mb-2" />
      <p className="text-[#a0a0b0] text-sm">
        {label ?? "This panel isn’t connected yet."}
      </p>
      <p className="text-[#a0a0b0]/60 text-xs mt-1">
        Run{" "}
        <code className="text-[#4d7dff]">
          supabase/admin-dashboard-setup.sql
        </code>{" "}
        in your app’s Supabase project to enable it.
      </p>
    </div>
  );
}

export function PanelEmpty({ label }: { label: string }) {
  return (
    <div className="glass-card rounded-xl px-4 py-8 text-center text-[#a0a0b0] text-sm">
      {label}
    </div>
  );
}
