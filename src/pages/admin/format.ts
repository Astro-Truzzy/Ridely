// Shared formatting + reduced-motion helpers for the admin dashboard.

export function formatDate(iso: string) {
  return new Date(iso).toLocaleString("en-NG", {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

export function formatDay(date: string) {
  return new Date(date + "T12:00:00").toLocaleDateString("en-NG", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

/** ₦ currency, compact for large numbers (₦1.2M), no decimals below 1000. */
export function formatNaira(value: number): string {
  const n = Number(value) || 0;
  const abs = Math.abs(n);
  if (abs >= 1_000_000) return `₦${(n / 1_000_000).toFixed(1)}M`;
  if (abs >= 10_000) return `₦${(n / 1_000).toFixed(1)}k`;
  return `₦${n.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

/** Compact integer (1.2k, 3.4M). */
export function formatCompact(value: number): string {
  const n = Number(value) || 0;
  if (Math.abs(n) >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (Math.abs(n) >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return n.toLocaleString("en-NG");
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined" || !window.matchMedia) return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}
