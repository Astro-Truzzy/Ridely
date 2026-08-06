const API_BASE = import.meta.env.VITE_API_URL ?? "";
const TOKEN_KEY = "ridely_admin_token";

export function getAdminToken(): string | null {
  return sessionStorage.getItem(TOKEN_KEY);
}

export function setAdminToken(token: string) {
  sessionStorage.setItem(TOKEN_KEY, token);
}

export function clearAdminToken() {
  sessionStorage.removeItem(TOKEN_KEY);
}

async function adminFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const token = getAdminToken();
  let response: Response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...init,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...init?.headers,
      },
    });
  } catch {
    throw new Error(
      "Cannot reach the API. If you're on localhost, run the Vite dev server (npm run dev) so /api is proxied, and confirm ADMIN_PASSWORD is set on Vercel.",
    );
  }

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(
      typeof body.error === "string" ? body.error : "Request failed",
    );
  }

  return body as T;
}

export async function adminLogin(
  password: string,
): Promise<{ success: true } | { error: string }> {
  try {
    const { token } = await adminFetch<{ token: string }>("/api/admin/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    });
    setAdminToken(token);
    return { success: true };
  } catch (err) {
    return {
      error: err instanceof Error ? err.message : "Login failed",
    };
  }
}

export interface DashboardStats {
  visits: {
    total: number;
    today: number;
    thisWeek: number;
    uniqueToday: number;
    uniqueThisWeek: number;
    perDay: { date: string; visits: number; unique: number }[];
    topPages: { path: string; count: number }[];
  };
  waitlist: {
    total: number;
    customers: number;
    riders: number;
    today: number;
    thisWeek: number;
  };
}

export interface WaitlistSignup {
  id: string;
  role: "customer" | "rider";
  name: string;
  email: string;
  city: string;
  sex: string | null;
  age: number | null;
  phone: string | null;
  created_at: string;
}

export function fetchDashboardStats() {
  return adminFetch<DashboardStats>("/api/admin/stats");
}

export function fetchWaitlistSignups(params?: {
  role?: string;
  search?: string;
  offset?: number;
}) {
  const query = new URLSearchParams();
  if (params?.role) query.set("role", params.role);
  if (params?.search) query.set("search", params.search);
  if (params?.offset) query.set("offset", String(params.offset));
  const qs = query.toString();
  return adminFetch<{ signups: WaitlistSignup[]; total: number }>(
    `/api/admin/waitlist${qs ? `?${qs}` : ""}`,
  );
}

export interface RiderVerificationDocument {
  id: string;
  rider_id: string;
  document_type: string;
  file_path: string;
  file_name: string | null;
  review_status: string;
  admin_notes: string | null;
  created_at: string;
  signed_url?: string | null;
}

export interface RiderVerificationApplication {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  vehicle_type: string | null;
  plate_number: string | null;
  account_verification_status: string;
  created_at: string;
  updated_at: string;
  documents: RiderVerificationDocument[];
}

export function fetchPendingRiderVerifications() {
  return adminFetch<{
    applications: RiderVerificationApplication[];
    total: number;
  }>("/api/admin/rider-verifications");
}

export function reviewRiderVerification(params: {
  action: "approve" | "reject";
  rider_id: string;
  admin_notes?: string;
}) {
  return adminFetch<{
    success: boolean;
    rider_id: string;
    account_verification_status: string;
  }>("/api/admin/rider-verifications", {
    method: "POST",
    body: JSON.stringify(params),
  });
}

// ── App operational metrics ─────────────────────────────────────────────────
// Every panel is wrapped in an {available, data} envelope so a not-yet-applied
// RPC (supabase/admin-dashboard-setup.sql) shows a "connect" state, not a crash.

export type MetricResult<T> =
  | { available: true; data: T }
  | { available: false; error?: string };

export interface Overview {
  users: {
    customers: number;
    riders: number;
    total: number;
    newToday: number;
    newThisWeek: number;
  };
  deliveries: {
    total: number;
    today: number;
    thisWeek: number;
    active: number;
    completed: number;
    cancelled: number;
  };
  revenue: {
    gross: number;
    commission: number;
    riderEarnings: number;
    walletFloat: number;
  };
}

export interface EarningsPoint {
  period: string;
  gross: number;
  commission: number;
  deliveries: number;
}

export interface FunnelStage {
  status: string;
  bucket: "active" | "completed" | "cancelled";
  count: number;
}

export interface Funnel {
  stages: FunnelStage[];
  total: number;
  completionRate: number;
}

export interface Hotzone {
  lat: number;
  lng: number;
  label: string;
  count: number;
  intensity: number;
}

export interface LeaderRider {
  id: string;
  name: string;
  earnings: number;
  deliveries: number;
}

export interface LeaderCustomer {
  id: string;
  name: string;
  spend: number;
  orders: number;
}

export interface Leaderboards {
  topRiders: LeaderRider[];
  topCustomers: LeaderCustomer[];
}

export interface ActivityItem {
  type: string;
  label: string;
  sub: string;
  at: string;
}

export type EarningsBucket = "day" | "week" | "month";

export interface AppMetrics {
  overview: MetricResult<Overview>;
  earnings: Record<EarningsBucket, MetricResult<EarningsPoint[]>>;
  funnel: MetricResult<Funnel>;
  hotzones: {
    delivery: MetricResult<Hotzone[]>;
    rider: MetricResult<Hotzone[]>;
  };
  leaderboards: MetricResult<Leaderboards>;
  activity: MetricResult<ActivityItem[]>;
}

export function fetchAppMetrics() {
  return adminFetch<AppMetrics>("/api/admin/metrics");
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: "customer" | "rider";
  wallet_balance: number;
  created_at: string | null;
}

export function fetchAppUsers(params?: {
  role?: string;
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const query = new URLSearchParams();
  if (params?.role) query.set("role", params.role);
  if (params?.search) query.set("search", params.search);
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.offset) query.set("offset", String(params.offset));
  const qs = query.toString();
  return adminFetch<{
    available: boolean;
    rows: AppUser[];
    total: number;
    error?: string;
  }>(`/api/admin/app-users${qs ? `?${qs}` : ""}`);
}
