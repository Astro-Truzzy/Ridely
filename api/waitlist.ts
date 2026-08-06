import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { waitUntil } from "@vercel/functions";
import { applyCors, corsHeaders, handleCorsOptions } from "./_lib/cors.js";

type WaitlistRole = "customer" | "rider";

interface WaitlistPayload {
  role: WaitlistRole;
  name: string;
  email: string;
  city: string;
  sex?: string;
  age?: string | number;
  phone?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function getEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing environment variable: ${name}`);
  return value;
}

function validatePayload(body: unknown): { data?: WaitlistPayload; error?: string } {
  if (!body || typeof body !== "object") {
    return { error: "Invalid request body" };
  }

  const { role, name, email, city, sex, age, phone } = body as WaitlistPayload;

  if (role !== "customer" && role !== "rider") {
    return { error: "Role must be customer or rider" };
  }
  if (!name?.trim()) return { error: "Name is required" };
  if (!email?.trim() || !EMAIL_RE.test(email.trim())) {
    return { error: "A valid email is required" };
  }
  if (!city?.trim()) return { error: "City is required" };

  if (role === "customer") {
    if (!sex || !["male", "female"].includes(sex)) {
      return { error: "Sex is required for customer signups" };
    }
  } else {
    const ageNum = typeof age === "string" ? parseInt(age, 10) : age;
    if (!ageNum || ageNum < 18) return { error: "Age must be 18 or older" };
    if (!phone?.trim()) return { error: "Phone number is required for riders" };
  }

  return {
    data: {
      role,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      city: city.trim(),
      sex: role === "customer" ? sex : undefined,
      age: role === "rider" ? String(age) : undefined,
      phone: role === "rider" ? phone?.trim() : undefined,
    },
  };
}

function buildUserEmailHtml(name: string, role: WaitlistRole) {
  const roleLabel = role === "customer" ? "customer" : "rider";
  return `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #0a0a0f; color: #ffffff; padding: 32px;">
      <div style="max-width: 520px; margin: 0 auto; background: #111118; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 32px;">
        <h1 style="margin: 0 0 8px; font-size: 24px; color: #ffffff;">You're on the Ridely waitlist!</h1>
        <p style="margin: 0 0 24px; color: #a0a0b0; line-height: 1.6;">
          Hi ${name}, thanks for joining as a ${roleLabel}. We'll reach out when Ridely launches in your area.
        </p>
        <p style="margin: 0; color: #a0a0b0; font-size: 14px; line-height: 1.6;">
          Fast, reliable, trackable delivery — coming soon to Benin City and beyond.
        </p>
        <hr style="border: none; border-top: 1px solid rgba(255,255,255,0.08); margin: 24px 0;" />
        <p style="margin: 0; color: #666; font-size: 12px;">Ridely · ridelyweb.com</p>
      </div>
    </div>
  `;
}

function buildAdminEmailHtml(payload: WaitlistPayload) {
  const rows = [
    ["Role", payload.role],
    ["Name", payload.name],
    ["Email", payload.email],
    ["City", payload.city],
    ...(payload.sex ? [["Sex", payload.sex]] : []),
    ...(payload.age ? [["Age", String(payload.age)]] : []),
    ...(payload.phone ? [["Phone", payload.phone]] : []),
  ];

  const tableRows = rows
    .map(
      ([label, value]) =>
        `<tr><td style="padding: 8px 12px; color: #a0a0b0; border-bottom: 1px solid #eee;">${label}</td><td style="padding: 8px 12px; border-bottom: 1px solid #eee;">${value}</td></tr>`,
    )
    .join("");

  return `
    <div style="font-family: sans-serif; padding: 24px;">
      <h2 style="margin: 0 0 16px;">New Ridely waitlist signup</h2>
      <table style="border-collapse: collapse; width: 100%; max-width: 480px;">${tableRows}</table>
    </div>
  `;
}

// Sends the confirmation + admin-notification emails. Runs in the background
// (via waitUntil) after the response is sent, so email latency never blocks the
// user. Never throws — failures are logged, and the signup is already saved.
async function sendWaitlistEmails(payload: WaitlistPayload) {
  try {
    const resend = new Resend(getEnv("RESEND_API_KEY"));
    const fromEmail = getEnv("RESEND_FROM_EMAIL");
    const adminEmail = process.env.ADMIN_NOTIFY_EMAIL ?? "Ridely.inc@gmail.com";

    const [userEmail, adminEmailResult] = await Promise.all([
      resend.emails.send({
        from: fromEmail,
        to: [payload.email],
        subject: "You're on the Ridely waitlist!",
        html: buildUserEmailHtml(payload.name, payload.role),
      }),
      resend.emails.send({
        from: fromEmail,
        to: [adminEmail],
        subject: `New waitlist signup: ${payload.name} (${payload.role})`,
        html: buildAdminEmailHtml(payload),
      }),
    ]);

    if (userEmail.error) {
      console.error("Resend user email error:", userEmail.error);
    }
    if (adminEmailResult.error) {
      console.error("Resend admin email error:", adminEmailResult.error);
    }
  } catch (err) {
    console.error("Waitlist email send failed:", err);
  }
}

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
    const { data: payload, error: validationError } = validatePayload(req.body);
    if (validationError || !payload) {
      return res.status(400).json({ error: validationError });
    }

    const supabase = createClient(
      getEnv("SUPABASE_URL"),
      getEnv("SUPABASE_SERVICE_ROLE_KEY"),
    );

    const row = {
      role: payload.role,
      name: payload.name,
      email: payload.email,
      city: payload.city,
      sex: payload.role === "customer" ? payload.sex : null,
      age: payload.role === "rider" ? parseInt(String(payload.age), 10) : null,
      phone: payload.role === "rider" ? payload.phone : null,
    };

    const { error: dbError } = await supabase.from("waitlist_signups").insert(row);

    if (dbError) {
      if (dbError.code === "23505") {
        return res.status(409).json({
          error: "This email is already on the waitlist for this role.",
        });
      }
      console.error("Supabase insert error:", dbError);
      return res.status(500).json({ error: "Failed to save signup. Please try again." });
    }

    // Signup is saved — respond immediately. Emails send in the background so
    // Resend latency never blocks the user. waitUntil keeps the serverless
    // function alive until the sends complete (a bare fire-and-forget would be
    // frozen the moment the response is sent).
    waitUntil(sendWaitlistEmails(payload));

    return res.status(201).json({ success: true });
  } catch (err) {
    console.error("Waitlist API error:", err);
    return res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
