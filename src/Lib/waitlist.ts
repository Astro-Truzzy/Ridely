export type WaitlistRole = "customer" | "rider";

export interface WaitlistSignup {
  role: WaitlistRole;
  name: string;
  email: string;
  city: string;
  sex?: string;
  age?: string;
  phone?: string;
}

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export async function submitWaitlistSignup(
  data: WaitlistSignup,
): Promise<{ success: true } | { error: string }> {
  const response = await fetch(`${API_BASE}/api/waitlist`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const body = await response.json().catch(() => ({}));

  if (!response.ok) {
    return {
      error:
        typeof body.error === "string"
          ? body.error
          : "Something went wrong. Please try again.",
    };
  }

  return { success: true };
}
