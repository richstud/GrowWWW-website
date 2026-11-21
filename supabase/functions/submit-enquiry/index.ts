// GrowWWW - website enquiry handler.
// 1. Validates the form and filters obvious spam (honeypot, too-fast submits, rate limit).
// 2. Saves the enquiry in public.contact_submissions (admin inbox).
// 3. Sends an instant Telegram alert.
// 4. Adds a row to the Google Sheet (via the Apps Script web app in docs/google-sheet-leads.gs).
//
// Secrets (Supabase dashboard -> Edge Functions -> Secrets):
//   TELEGRAM_BOT_TOKEN  - from @BotFather
//   TELEGRAM_CHAT_ID    - your chat id (or a group id, starts with -100...)
//   SITE_ADMIN_URL      - optional, e.g. https://www.growwww.in/admin/dashboard
//   GOOGLE_SHEET_WEBHOOK_URL - the Apps Script "Web app" URL (ends in /exec)
//   GOOGLE_SHEET_SECRET      - the same secret written at the top of the Apps Script
// SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are provided by Supabase automatically.
import { createClient } from "jsr:@supabase/supabase-js@2";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const json = (body: unknown, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { ...cors, "Content-Type": "application/json" } });

const clean = (v: unknown, max: number) => {
  if (typeof v !== "string") return null;
  const s = v.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim();
  return s ? s.slice(0, max) : null;
};

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

async function sha256(text: string) {
  const buf = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, "0")).join("");
}

async function sendTelegram(text: string, buttons: { text: string; url: string }[] = []) {
  const token = Deno.env.get("TELEGRAM_BOT_TOKEN");
  const chatId = Deno.env.get("TELEGRAM_CHAT_ID");
  if (!token || !chatId) return { ok: false, reason: "Telegram secrets not set" };
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: "HTML",
      disable_web_page_preview: true,
      reply_markup: buttons.length ? { inline_keyboard: [buttons] } : undefined,
    }),
  });
  const data = await res.json().catch(() => ({}));
  return { ok: res.ok && data.ok, reason: data.description };
}

/** Appends one lead to the Google Sheet through the Apps Script web app. */
async function sendToSheet(lead: Record<string, string | null>) {
  const url = Deno.env.get("GOOGLE_SHEET_WEBHOOK_URL");
  const secret = Deno.env.get("GOOGLE_SHEET_SECRET");
  if (!url || !secret) return { ok: false, skipped: true, reason: "Google Sheet secrets not set" };
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "text/plain;charset=utf-8" }, // Apps Script reads the raw body
      body: JSON.stringify({ secret, ...lead }),
      redirect: "follow",
    });
    const text = await res.text();
    let data: { ok?: boolean; error?: string } = {};
    try { data = JSON.parse(text); } catch { /* Google returned an HTML page */ }
    if (data.ok) return { ok: true };
    return { ok: false, reason: data.error || `Google Sheet replied ${res.status}. Check the web app is deployed with access "Anyone".` };
  } catch (e) {
    return { ok: false, reason: `Couldn't reach Google Sheet: ${(e as Error).message}` };
  }
}

const istNow = () => new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "medium", timeStyle: "short" });

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: cors });
  if (req.method !== "POST") return json({ error: "Method not allowed" }, 405);

  const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!, {
    auth: { persistSession: false },
  });

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "Invalid request" }, 400);
  }

  // --- Admin-only: send a test alert from the admin panel ---
  if (body.test === true) {
    const jwt = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
    const { data: u } = await admin.auth.getUser(jwt);
    if (!u?.user) return json({ error: "Sign in first" }, 401);
    const { data: role } = await admin.from("user_roles").select("role").eq("user_id", u.user.id).eq("role", "admin").maybeSingle();
    if (!role) return json({ error: "Admins only" }, 403);
    const [tg, sheet] = await Promise.all([
      sendTelegram("✅ <b>GrowWWW test alert</b>\nTelegram is connected. New website enquiries will arrive here."),
      sendToSheet({ date: istNow(), name: "TEST - please delete", phone: "", email: u.user.email ?? "", company: "", service: "Test from admin", budget: "", message: "If you can see this row, the Google Sheet is connected.", source_page: "/admin", status: "test" }),
    ]);
    return json({ ok: tg.ok && (sheet.ok || !!sheet.skipped), telegram: tg, sheet, error: !tg.ok ? tg.reason || "Telegram failed" : !sheet.ok && !sheet.skipped ? sheet.reason : undefined });
  }

  // --- Spam checks ---
  if (clean(body.website, 200)) return json({ ok: true }); // honeypot filled -> silently accept
  const elapsed = Number(body.elapsed_ms);
  const tooFast = Number.isFinite(elapsed) && elapsed < 2500;

  const name = clean(body.name, 120);
  const email = clean(body.email, 200);
  const phone = clean(body.phone, 30);
  const company = clean(body.company, 150);
  const service = clean(body.service, 80);
  const budget = clean(body.budget, 60);
  const message = clean(body.message, 4000);
  const sourcePage = clean(body.source_page, 300);

  if (!name) return json({ error: "Please enter your name." }, 400);
  if (!email && !phone) return json({ error: "Please add a phone number or email so we can reply." }, 400);
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) return json({ error: "Please check your email address." }, 400);
  if (phone && phone.replace(/\D/g, "").length < 7) return json({ error: "Please check your phone number." }, 400);

  const ip = (req.headers.get("x-forwarded-for") || "").split(",")[0].trim() || "unknown";
  const ipHash = await sha256(ip + (Deno.env.get("IP_SALT") || "growwww"));
  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count } = await admin
    .from("contact_submissions")
    .select("id", { count: "exact", head: true })
    .eq("ip_hash", ipHash)
    .gte("created_at", since);
  if ((count ?? 0) >= 5) return json({ error: "Too many enquiries from this connection. Please call or WhatsApp us instead." }, 429);

  const { data: row, error } = await admin
    .from("contact_submissions")
    .insert({ name, email, phone, company, service, budget, message, source_page: sourcePage, ip_hash: ipHash, status: tooFast ? "spam" : "new" })
    .select("id")
    .single();
  if (error) {
    console.error("insert failed", error);
    return json({ error: "Something went wrong. Please call or WhatsApp us." }, 500);
  }

  if (!tooFast) {
    const when = istNow();
    const lines = [
      "🔔 <b>New enquiry - GrowWWW</b>",
      "",
      `👤 <b>${esc(name)}</b>${company ? ` · ${esc(company)}` : ""}`,
      phone ? `📞 ${esc(phone)}` : "",
      email ? `✉️ ${esc(email)}` : "",
      service ? `🛠 ${esc(service)}` : "",
      budget ? `💰 ${esc(budget)}` : "",
      message ? `\n💬 ${esc(message.slice(0, 1500))}` : "",
      "",
      `🌐 ${esc(sourcePage || "website")} · ${when} IST`,
    ].filter((l) => l !== "");
    const buttons: { text: string; url: string }[] = [];
    const digits = (phone || "").replace(/\D/g, "");
    if (digits.length >= 10) {
      const wa = digits.length === 10 ? "91" + digits : digits;
      buttons.push({ text: "💬 WhatsApp", url: `https://wa.me/${wa}` });
    }
    const adminUrl = Deno.env.get("SITE_ADMIN_URL");
    if (adminUrl) buttons.push({ text: "📥 Open inbox", url: adminUrl });
    const [r, sheet] = await Promise.all([
      sendTelegram(lines.join("\n"), buttons),
      sendToSheet({ date: when, name, phone, email, company, service, budget, message, source_page: sourcePage, status: "new" }),
    ]);
    if (r.ok) await admin.from("contact_submissions").update({ telegram_sent: true }).eq("id", row.id);
    else console.warn("telegram not sent:", r.reason);
    if (!sheet.ok && !sheet.skipped) console.warn("sheet not updated:", sheet.reason);
  }

  return json({ ok: true });
});
