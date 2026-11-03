const SESSION_KEY = "ridely_sid";
const API_BASE = (import.meta.env.VITE_API_URL ?? "").replace(/\/+$/, "");

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

export function trackPageVisit(path: string) {
  fetch(`${API_BASE}/api/visit`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      path,
      referrer: document.referrer || null,
      sessionId: getSessionId(),
    }),
    keepalive: true,
  }).catch(() => {});
}
