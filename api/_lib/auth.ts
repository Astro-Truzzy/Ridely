import crypto from "crypto";
import type { VercelRequest } from "@vercel/node";

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;

function getAdminSecret(): string {
  const secret = process.env.ADMIN_SECRET ?? process.env.ADMIN_PASSWORD;
  if (!secret) throw new Error("Missing ADMIN_SECRET or ADMIN_PASSWORD");
  return secret;
}

export function createAdminToken(): string {
  const payload = { exp: Date.now() + TOKEN_TTL_MS };
  const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const sig = crypto
    .createHmac("sha256", getAdminSecret())
    .update(data)
    .digest("base64url");
  return `${data}.${sig}`;
}

export function verifyAdminToken(token: string | undefined): boolean {
  if (!token) return false;
  const [data, sig] = token.split(".");
  if (!data || !sig) return false;

  const expected = crypto
    .createHmac("sha256", getAdminSecret())
    .update(data)
    .digest("base64url");
  if (sig !== expected) return false;

  try {
    const payload = JSON.parse(Buffer.from(data, "base64url").toString()) as {
      exp: number;
    };
    return payload.exp > Date.now();
  } catch {
    return false;
  }
}

export function getBearerToken(req: VercelRequest): string | undefined {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) return undefined;
  return header.slice(7);
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  return password === expected;
}
