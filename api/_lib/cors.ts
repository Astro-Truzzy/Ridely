export function corsHeaders(origin: string | undefined, methods = "GET, POST, OPTIONS") {
  const allowed = process.env.ALLOWED_ORIGIN ?? "*";
  const allowOrigin =
    allowed === "*" || (origin && allowed.split(",").includes(origin))
      ? origin ?? "*"
      : allowed.split(",")[0];

  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": methods,
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
  };
}
