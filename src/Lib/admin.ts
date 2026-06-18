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
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
  });

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
