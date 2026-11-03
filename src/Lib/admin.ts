// Same-origin by default (VITE_API_URL unset): no CORS, no preflight, works on
// apex, www, preview deployments, and localhost (via the Vite proxy).
// Only set VITE_API_URL locally (in .env.local, never in Vercel) when you need
// local dev against a deployed API — baking an absolute URL into a build makes
// every other host cross-origin, and apex↔www redirects kill CORS preflights.
const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");
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
  } catch (err) {
    // fetch() itself rejected: DNS, connection refused, TLS, or offline —
    // the API never answered, so there is no status code to report.
    console.error(`Admin API network error (${path}):`, err);
    const host = window.location.hostname;
    const onLocalhost =
      host === "localhost" || host === "127.0.0.1" || host === "[::1]";
    throw new Error(
      onLocalhost
        ? "Cannot reach the API. Run the Vite dev server (npm run dev) so /api is proxied."
        : `Cannot reach the API (network error, no response). The page loaded but ${path} did not answer — confirm the latest code is deployed on Vercel and ADMIN_PASSWORD is set in the project environment variables.`,
    );
  }

  const body = (await response.json().catch(() => ({}))) as {
    error?: unknown;
  };

  if (!response.ok) {
    const serverMessage =
      typeof body.error === "string" ? body.error : null;
    console.error(`Admin API error ${response.status} (${path}):`, body);
    throw new Error(serverMessage ?? `Request failed (HTTP ${response.status})`);
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

/**
 * Permanently delete a customer or rider (profile + wallet + auth login).
 * Financial history is kept by default: if ledger rows still reference the
 * profile the delete is refused with a 409. Pass purgeLedger: true to also
 * delete the ledger rows (money history is destroyed — the dashboard asks for
 * explicit opt-in via checkbox before sending this).
 */
export function deleteAppUser(params: {
  id: string;
  role: "customer" | "rider";
  purgeLedger?: boolean;
}) {
  const query = new URLSearchParams({ id: params.id, role: params.role });
  if (params.purgeLedger) query.set("purgeLedger", "true");
  return adminFetch<{ success: true; deleted: boolean; authRemoved: boolean }>(
    `/api/admin/app-users?${query.toString()}`,
    { method: "DELETE" },
  );
}

export interface WalletHolder {
  id: string;
  name: string;
  email: string;
  wallet_balance: number;
}

export function fetchWalletBalances(params?: {
  search?: string;
  limit?: number;
  offset?: number;
}) {
  const query = new URLSearchParams();
  if (params?.search) query.set("search", params.search);
  if (params?.limit) query.set("limit", String(params.limit));
  if (params?.offset) query.set("offset", String(params.offset));
  const qs = query.toString();
  return adminFetch<{
    available: boolean;
    rows: WalletHolder[];
    total: number;
    sum: number;
    error?: string;
  }>(`/api/admin/wallets${qs ? `?${qs}` : ""}`);
}
