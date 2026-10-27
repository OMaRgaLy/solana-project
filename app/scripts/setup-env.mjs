// One-time helper: fills in the generated secrets and the bot username in app/.env.
// Existing non-empty values are never overwritten. Secret values are not printed.
import { randomBytes } from "node:crypto";
import { readFileSync, writeFileSync } from "node:fs";

const FILE = ".env";
let text = readFileSync(FILE, "utf8");
const get = (k) => new RegExp(`^${k}=(.*)$`, "m").exec(text)?.[1]?.trim() ?? "";
const set = (k, v) => {
  const re = new RegExp(`^${k}=.*$`, "m");
  text = re.test(text) ? text.replace(re, `${k}=${v}`) : `${text.replace(/\s*$/, "\n")}${k}=${v}\n`;
};
const rand = () => randomBytes(24).toString("hex");

const token = get("TELEGRAM_BOT_TOKEN");
if (!token) throw new Error("TELEGRAM_BOT_TOKEN is empty in app/.env");

if (!get("TELEGRAM_WEBHOOK_SECRET")) set("TELEGRAM_WEBHOOK_SECRET", rand());
if (!get("SESSION_SECRET")) set("SESSION_SECRET", rand());
if (!get("CRON_SECRET")) set("CRON_SECRET", rand());

const me = await fetch(`https://api.telegram.org/bot${token}/getMe`).then((r) => r.json());
if (!me.ok) throw new Error("Telegram rejected the token: " + me.description);
set("NEXT_PUBLIC_TELEGRAM_BOT", me.result.username);

writeFileSync(FILE, text);
console.log(`OK. Bot: @${me.result.username}. Secrets generated and saved to app/.env.`);
