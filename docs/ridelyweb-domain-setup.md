# Connect `ridelyweb.com` (Hostinger) to Ridely on Vercel

This guide connects your Hostinger domain **ridelyweb.com** to the Ridely website deployed on Vercel.

| Item | Value |
|------|-------|
| **Domain** | `ridelyweb.com` |
| **Registrar / DNS host** | Hostinger |
| **Hosting** | Vercel (Ridely project) |
| **Method** | DNS records at Hostinger (keep Hostinger nameservers) |

---

## DNS records to add (exact values)

Add these records in **Hostinger → Domains → ridelyweb.com → DNS / DNS Zone**.

### Record 1 — Apex (root domain)

| Field | Value |
|-------|-------|
| **Type** | `A` |
| **Name / Host** | `@` |
| **Points to / Value** | `76.76.21.21` |
| **TTL** | `14400` (or Hostinger default) |

Serves: `https://ridelyweb.com`

### Record 2 — WWW subdomain

| Field | Value |
|-------|-------|
| **Type** | `CNAME` |
| **Name / Host** | `www` |
| **Points to / Value** | `cname.vercel-dns.com` |
| **TTL** | `14400` (or Hostinger default) |

Serves: `https://www.ridelyweb.com`

> **Important:** After you add the domain in Vercel (Step 1), confirm the CNAME value on the Vercel Domains page. Vercel may show a project-specific CNAME (e.g. `xxxxxxxx.vercel-dns-017.com`) instead of `cname.vercel-dns.com`. **Use the value Vercel displays for your project.**

---

## Records to remove or change (Hostinger)

Before adding the Vercel records, delete or edit any existing records that conflict:

| Type | Name | Action |
|------|------|--------|
| `A` | `@` | **Delete** if it points to Hostinger (e.g. `185.x.x.x`, parking IP) |
| `AAAA` | `@` | **Delete** if present and not required |
| `CNAME` | `www` | **Delete** if it points to Hostinger |
| `CNAME` | `@` | **Delete** if present (apex CNAME often breaks email) |

### Do not delete (if you use Hostinger email)

| Type | Name | Action |
|------|------|--------|
| `MX` | `@` | **Keep** — required for email |
| `TXT` | `@` | **Keep** — SPF, DKIM, domain verification |
| Other `TXT` / `CNAME` | mail, autodiscover, etc. | **Keep** unless you know they are unused |

### Nameservers — leave as Hostinger

Keep Hostinger nameservers (typically `ns1.dns-parking.com` / `ns2.dns-parking.com` or Hostinger’s assigned pair). **Do not** switch to Vercel nameservers unless you intentionally move all DNS to Vercel.

---

## Step-by-step process

### Step 1 — Add domains in Vercel

1. Go to [vercel.com](https://vercel.com) and open your **Ridely** project.
2. Open **Settings → Domains**.
3. Click **Add Domain** and enter:
   ```
   ridelyweb.com
   ```
4. When prompted, also add:
   ```
   www.ridelyweb.com
   ```
5. Note the DNS instructions Vercel shows. They should match:

   | Domain | Record type | Value |
   |--------|-------------|-------|
   | `ridelyweb.com` | `A` → `@` | `76.76.21.21` |
   | `www.ridelyweb.com` | `CNAME` → `www` | `cname.vercel-dns.com` *(or Vercel’s project-specific CNAME)* |

6. If Vercel asks for a **TXT** record (domain owned by another Vercel account), add exactly what it shows, for example:

   | Type | Name | Value |
   |------|------|-------|
   | `TXT` | `_vercel` | *(copy from Vercel dashboard)* |

   Only add this if Vercel explicitly requests verification.

---

### Step 2 — Configure DNS in Hostinger

1. Log in to [hpanel.hostinger.com](https://hpanel.hostinger.com).
2. Go to **Domains** → **ridelyweb.com** → **DNS Zone** (or **Manage DNS**).
3. Remove conflicting `A` / `CNAME` records for `@` and `www` (see table above).
4. Add **Record 1** (`A` → `@` → `76.76.21.21`).
5. Add **Record 2** (`CNAME` → `www` → `cname.vercel-dns.com` or Vercel’s shown value).
6. Save changes.

---

### Step 3 — Set primary domain in Vercel

1. In Vercel **Settings → Domains**, set the primary domain:
   - Recommended: **`ridelyweb.com`** (non-www)
2. Vercel will redirect `www.ridelyweb.com` → `ridelyweb.com` (or the reverse, depending on your choice).

---

### Step 4 — Wait for propagation and SSL

| Check | Expected result |
|-------|-----------------|
| Vercel Domains status | **Valid Configuration** (green) |
| `https://ridelyweb.com` | Loads Ridely site |
| `https://www.ridelyweb.com` | Redirects to primary domain |
| SSL | Automatic — issued by Vercel after DNS is valid |

**Typical wait time:** 15 minutes to 4 hours (up to 48 hours in rare cases).

**Verify DNS globally:**

- Apex: [dnschecker.org/#A/ridelyweb.com](https://dnschecker.org/#A/ridelyweb.com) → should show `76.76.21.21`
- WWW: [dnschecker.org/#CNAME/www.ridelyweb.com](https://dnschecker.org/#CNAME/www.ridelyweb.com) → should show `cname.vercel-dns.com` (or your Vercel CNAME target)

---

## Final DNS zone (reference)

After setup, the website-related records should look like this:

```
Type    Name    Value                    TTL
----    ----    -----                    ---
A       @       76.76.21.21              14400
CNAME   www     cname.vercel-dns.com     14400
```

Plus any **MX** / **TXT** records you kept for email.

---

## Optional — Vercel CLI

If the Vercel CLI is installed and the project is linked:

```bash
vercel domains add ridelyweb.com
vercel domains add www.ridelyweb.com
```

DNS is still configured in Hostinger using the same values above.

Inspect configuration:

```bash
vercel domains inspect ridelyweb.com
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Hostinger parking / “coming soon” page | Remove old `A` record on `@` pointing to Hostinger |
| `ridelyweb.com` works, `www` does not | Add or fix `CNAME` for `www` |
| `www` works, `ridelyweb.com` does not | Add or fix `A` record for `@` → `76.76.21.21` |
| Vercel shows “Invalid Configuration” | Wait for DNS; re-check record names and values (no `https://`, no trailing paths) |
| SSL not ready | Wait until Vercel marks domain **Valid** |
| Email stopped working | Restore **MX** and mail-related **TXT** records in Hostinger |
| Domain used on Hostinger hosting | Disable/remove the Hostinger website for `ridelyweb.com` so it does not conflict |

---

## Checklist

- [ ] Added `ridelyweb.com` in Vercel → Settings → Domains
- [ ] Added `www.ridelyweb.com` in Vercel
- [ ] Hostinger: `A` record `@` → `76.76.21.21`
- [ ] Hostinger: `CNAME` record `www` → `cname.vercel-dns.com` (or Vercel’s shown CNAME)
- [ ] Removed old Hostinger `A` / `CNAME` for `@` and `www`
- [ ] Kept `MX` / email `TXT` records if using Hostinger email
- [ ] Set primary domain in Vercel (`ridelyweb.com` recommended)
- [ ] Vercel domain status: **Valid**
- [ ] `https://ridelyweb.com` loads the Ridely site

---

*Last updated for domain: **ridelyweb.com** · Hosting: **Vercel** · DNS: **Hostinger***
