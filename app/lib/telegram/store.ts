// Tiny key-value layer for the bot, sessions' login handshake and user finance documents.
//  * Upstash Redis (REST) when configured — required on Vercel, where server memory does not persist.
//  * Otherwise a JSON file in .data/ (local development), so state survives `npm run dev` restarts.
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const URL_ = process.env.UPSTASH_REDIS_REST_URL;
const TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;
const remote = () => Boolean(URL_ && TOKEN);

async function redis<T>(...cmd: (string | number)[]): Promise<T> {
  const r = await fetch(URL_!, {
    method: "POST",
    headers: { Authorization: `Bearer ${TOKEN}`, "Content-Type": "application/json" },
    body: JSON.stringify(cmd),
    cache: "no-store",
  });
  if (!r.ok) throw new Error(`redis ${r.status}`);
  return ((await r.json()) as { result: T }).result;
}

type Snapshot = { kv: Record<string, { v: string; exp?: number }>; sets: Record<string, string[]> };
const FILE = join(process.cwd(), ".data", "store.json");
const persistToDisk = !process.env.VERCEL; // Vercel's filesystem is read-only/ephemeral
let snap: Snapshot | null = null;

function local(): Snapshot {
  if (!snap) {
    try {
      snap = JSON.parse(readFileSync(FILE, "utf8")) as Snapshot;
    } catch {
      snap = { kv: {}, sets: {} };
    }
  }
  return snap;
}

function flush() {
  if (!persistToDisk || !snap) return;
  try {
    if (!existsSync(join(process.cwd(), ".data"))) mkdirSync(join(process.cwd(), ".data"), { recursive: true });
    writeFileSync(FILE, JSON.stringify(snap));
  } catch {
    /* best effort */
  }
}

export const storeIsPersistent = () => remote() || persistToDisk;

export async function kvGet(key: string): Promise<string | null> {
  if (remote()) return redis<string | null>("GET", key);
  const e = local().kv[key];
  if (!e) return null;
  if (e.exp && e.exp < Date.now()) {
    delete local().kv[key];
    return null;
  }
  return e.v;
}

export async function kvSet(key: string, value: string, ttlSec?: number): Promise<void> {
  if (remote()) {
    await (ttlSec ? redis("SET", key, value, "EX", ttlSec) : redis("SET", key, value));
    return;
  }
  local().kv[key] = { v: value, ...(ttlSec ? { exp: Date.now() + ttlSec * 1000 } : {}) };
  flush();
}

export async function kvDel(key: string): Promise<void> {
  if (remote()) {
    await redis("DEL", key);
    return;
  }
  delete local().kv[key];
  flush();
}

/** Returns true when the member was newly added. */
export async function setAdd(key: string, member: string): Promise<boolean> {
  if (remote()) return (await redis<number>("SADD", key, member)) === 1;
  const s = local().sets;
  const list = (s[key] ??= []);
  if (list.includes(member)) return false;
  list.push(member);
  flush();
  return true;
}

export async function setMembers(key: string): Promise<string[]> {
  return remote() ? redis<string[]>("SMEMBERS", key) : [...(local().sets[key] ?? [])];
}
