// `npm run dev` — one command: ngrok tunnel + Telegram webhook + Next dev server.
//   * the tunnel gives Telegram a public https URL for your local machine;
//   * the webhook is (re)registered to that URL on every start, so nothing is configured by hand;
//   * the site and the bot run in the same process, so login, wallet linking and alerts just work.
// Without a bot token (or with `--plain`) it falls back to a plain `next dev`.
import { spawn, execSync } from "node:child_process";
import { readFileSync } from "node:fs";

for (const f of [".env", ".env.local"]) {
  try {
    for (const line of readFileSync(f, "utf8").split(/\r?\n/)) {
      const m = /^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/.exec(line);
      if (m && m[2] && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
    }
  } catch {}
}

const PORT = 3000;
const { TELEGRAM_BOT_TOKEN: token, TELEGRAM_WEBHOOK_SECRET: secret, NGROK_DOMAIN: domain } = process.env;
const children = [];
const killTree = (c) => {
  try {
    if (process.platform === "win32") execSync(`taskkill /pid ${c.pid} /T /F`, { stdio: "ignore" });
    else c.kill("SIGTERM");
  } catch {}
};
const shutdown = () => { children.forEach(killTree); process.exit(0); };
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function findTunnel() {
  try {
    const { tunnels } = await fetch("http://127.0.0.1:4040/api/tunnels").then((r) => r.json());
    return tunnels.find((t) => t.public_url.startsWith("https://") && t.config?.addr?.endsWith(`:${PORT}`))?.public_url ?? null;
  } catch {
    return null;
  }
}

async function openTunnel() {
  let url = await findTunnel(); // reuse a tunnel that is already running
  if (url) return url;
  const args = ["http", String(PORT), ...(domain ? [`--url=${domain}`] : [])];
  const ng = spawn("ngrok", args, { stdio: "ignore", shell: true });
  children.push(ng);
  for (let i = 0; i < 30 && !url; i++) {
    await sleep(500);
    url = await findTunnel();
  }
  return url;
}

let siteUrl = `http://localhost:${PORT}`;
if (token && secret && !process.argv.includes("--plain")) {
  const tunnel = await openTunnel();
  if (!tunnel) {
    console.error("\n[dev] ngrok did not start (is `ngrok config add-authtoken` done?). Running without the bot.\n");
  } else {
    siteUrl = tunnel;
    const res = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ url: `${tunnel}/api/telegram/webhook`, secret_token: secret, allowed_updates: ["message", "callback_query"] }),
    }).then((r) => r.json());
    console.log(res.ok ? `[dev] Telegram webhook -> ${tunnel}/api/telegram/webhook` : `[dev] setWebhook failed: ${res.description}`);
  }
}
console.log(`\n[dev] Open the site: ${siteUrl}\n`);

const next = spawn("npx", ["next", "dev", "-p", String(PORT)], {
  stdio: "inherit",
  shell: true,
  env: { ...process.env, NEXT_PUBLIC_SITE_URL: siteUrl },
});
children.push(next);
next.on("exit", (code) => { children.forEach(killTree); process.exit(code ?? 0); });
