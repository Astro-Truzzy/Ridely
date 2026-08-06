import {
  LayoutDashboard,
  Users,
  Package,
  Wallet,
  ShieldCheck,
  BarChart3,
} from "lucide-react";

export type SectionId =
  | "overview"
  | "users"
  | "deliveries"
  | "finance"
  | "verification"
  | "traffic";

export interface NavItem {
  id: SectionId;
  label: string;
  icon: React.ReactNode;
  badge?: number;
}

const ICON = "w-5 h-5 shrink-0";

export function buildNav(pendingVerifications: number): NavItem[] {
  return [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className={ICON} /> },
    { id: "users", label: "Users", icon: <Users className={ICON} /> },
    { id: "deliveries", label: "Deliveries", icon: <Package className={ICON} /> },
    { id: "finance", label: "Finance", icon: <Wallet className={ICON} /> },
    {
      id: "verification",
      label: "Verification",
      icon: <ShieldCheck className={ICON} />,
      badge: pendingVerifications || undefined,
    },
    { id: "traffic", label: "Traffic", icon: <BarChart3 className={ICON} /> },
  ];
}
