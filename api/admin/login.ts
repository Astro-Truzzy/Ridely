import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createAdminToken, verifyAdminPassword } from "../_lib/auth.js";
import { applyCors, corsHeaders, handleCorsOptions } from "../_lib/cors.js";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const headers = corsHeaders(req.headers.origin, "POST, OPTIONS");

  if (req.method === "OPTIONS") {
    return handleCorsOptions(res, headers);
  }

  applyCors(res, headers);

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { password } = req.body ?? {};
    if (!password || typeof password !== "string") {
      return res.status(400).json({ error: "Password is required" });
    }

    if (!verifyAdminPassword(password)) {
      return res.status(401).json({ error: "Invalid password" });
    }

    return res.status(200).json({ token: createAdminToken() });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ error: "Login failed" });
  }
}
