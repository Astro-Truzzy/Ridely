import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getBearerToken, verifyAdminToken } from "../_lib/auth.js";
import { applyCors, corsHeaders, handleCorsOptions } from "../_lib/cors.js";
import { getSupabase } from "../_lib/supabase.js";

function startOfDay(d = new Date()) {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date.toISOString();
}

function daysAgo(n: number) {
  const d = new Date();
  d.setDate(d.getDate() - n);
  d.setHours(0, 0, 0, 0);
  return d.toISOString();
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const headers = corsHeaders(req.headers.origin, "GET, OPTIONS");

  if (req.method === "OPTIONS") {
    return handleCorsOptions(res, headers);
  }

  applyCors(res, headers);

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!verifyAdminToken(getBearerToken(req))) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const supabase = getSupabase();
    const today = startOfDay();
    const weekAgo = daysAgo(7);

    const [
      visitsTotal,
      visitsToday,
      visitsWeek,
      waitlistTotal,
      waitlistCustomers,
      waitlistRiders,
      waitlistToday,
      waitlistWeek,
      visitsByDay,
      topPages,
    ] = await Promise.all([
      supabase.from("page_visits").select("id", { count: "exact", head: true }),
      supabase
        .from("page_visits")
        .select("id", { count: "exact", head: true })
        .gte("created_at", today),
      supabase
        .from("page_visits")
        .select("id", { count: "exact", head: true })
        .gte("created_at", weekAgo),
      supabase.from("waitlist_signups").select("id", { count: "exact", head: true }),
      supabase
        .from("waitlist_signups")
        .select("id", { count: "exact", head: true })
        .eq("role", "customer"),
      supabase
        .from("waitlist_signups")
        .select("id", { count: "exact", head: true })
        .eq("role", "rider"),
      supabase
        .from("waitlist_signups")
        .select("id", { count: "exact", head: true })
        .gte("created_at", today),
      supabase
        .from("waitlist_signups")
        .select("id", { count: "exact", head: true })
        .gte("created_at", weekAgo),
      supabase
        .from("page_visits")
        .select("created_at, session_id")
        .gte("created_at", weekAgo)
        .order("created_at", { ascending: true }),
      supabase.from("page_visits").select("path").gte("created_at", weekAgo),
    ]);

    const weekVisits = visitsByDay.data ?? [];
    const uniqueToday = new Set(
      weekVisits
        .filter((v) => v.created_at >= today)
        .map((v) => v.session_id),
    ).size;
    const uniqueWeek = new Set(weekVisits.map((v) => v.session_id)).size;

    const dailyMap = new Map<string, { visits: number; sessions: Set<string> }>();
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      dailyMap.set(d.toISOString().slice(0, 10), { visits: 0, sessions: new Set() });
    }

    for (const visit of weekVisits) {
      const day = visit.created_at.slice(0, 10);
      const bucket = dailyMap.get(day);
      if (bucket) {
        bucket.visits += 1;
        bucket.sessions.add(visit.session_id);
      }
    }

    const visitsPerDay = Array.from(dailyMap.entries()).map(([date, data]) => ({
      date,
      visits: data.visits,
      unique: data.sessions.size,
    }));

    const pageCounts = new Map<string, number>();
    for (const row of topPages.data ?? []) {
      pageCounts.set(row.path, (pageCounts.get(row.path) ?? 0) + 1);
    }
    const topPagesList = Array.from(pageCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path, count]) => ({ path, count }));

    return res.status(200).json({
      visits: {
        total: visitsTotal.count ?? 0,
        today: visitsToday.count ?? 0,
        thisWeek: visitsWeek.count ?? 0,
        uniqueToday,
        uniqueThisWeek: uniqueWeek,
        perDay: visitsPerDay,
        topPages: topPagesList,
      },
      waitlist: {
        total: waitlistTotal.count ?? 0,
        customers: waitlistCustomers.count ?? 0,
        riders: waitlistRiders.count ?? 0,
        today: waitlistToday.count ?? 0,
        thisWeek: waitlistWeek.count ?? 0,
      },
    });
  } catch (err) {
    console.error("Admin stats error:", err);
    return res.status(500).json({ error: "Failed to load stats" });
  }
}
