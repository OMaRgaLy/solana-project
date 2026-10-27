// Points the Telegram bot at a deployed site (production). One command, no secrets printed.
//
//   npm run webhook -- https://steppe-invoice-delta.vercel.app
//
// A bot has exactly ONE webhook. `npm run dev` re-points it to your local tunnel on every start, so use a separate
// bot for development (create a second one in @BotFather) and keep the production bot's token only in Vercel.
import { readFileSync } from "node:fs";

for (const f of [".env", ".env.local"]) {
  try {
    for (const line of readFileSync(f, "utf8").split(/\r?\n/)) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
      if (m && m[2] && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {}
}

const site = (process.argv[2] || "").replace(/\/$/, "");
const { TELEGRAM_BOT_TOKEN: token, TELEGRAM_WEBHOOK_SECRET: secret } = process.env;
if (!/^https:\/\//.test(site)) {
  console.error("Usage: npm run webhook -- https://your-site.vercel.app");
  process.exit(1);
}
if (!token || !secret) {
  console.error("TELEGRAM_BOT_TOKEN and TELEGRAM_WEBHOOK_SECRET must be set in app/.env (they must match the values in Vercel).");
  process.exit(1);
}

const api = (method, body) =>
  fetch(`https://api.telegram.org/bot${token}/${method}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body ?? {}),
  }).then((r) => r.json());

const set = await api("setWebhook", {
  url: `${site}/api/telegram/webhook`,
  secret_token: secret,
  allowed_updates: ["message", "callback_query"],
});
console.log(set.ok ? `Webhook set: ${site}/api/telegram/webhook` : `Failed: ${set.description}`);
const info = (await api("getWebhookInfo")).result ?? {};
console.log(`Telegram sees: ${info.url} | pending updates: ${info.pending_update_count} | last error: ${info.last_error_message ?? "none"}`);
