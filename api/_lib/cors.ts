import type { VercelResponse } from "@vercel/node";

export function corsHeaders(
  origin: string | undefined,
  methods = "GET, POST, OPTIONS",
) {
  const allowed = process.env.ALLOWED_ORIGIN ?? "*";
  const allowedList = allowed
    .split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  const allowOrigin =
    allowed === "*" || (origin && allowedList.includes(origin))
      ? (origin ?? "*")
      : (allowedList[0] ?? "*");

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}

export function applyCors(
  res: VercelResponse,
  headers: Record<string, string>,
) {
  Object.entries(headers).forEach(([key, value]) => res.setHeader(key, value));
}

/** Respond to CORS preflight with the full header set (not only Allow-Origin). */
export function handleCorsOptions(
  res: VercelResponse,
  headers: Record<string, string>,
) {
  applyCors(res, headers);
  return res.status(204).end();
}
