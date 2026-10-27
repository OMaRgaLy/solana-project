// Hybrid hosting: the website is served by Vercel, but anything that needs a server-side state (login, the user's
// finance records, Telegram alerts) runs on the owner's computer, reached through its ngrok address.
//
// On Vercel NEXT_PUBLIC_BACKEND_URL is set (see .env.production), and the routes that need state call
// `proxyIfRemote` first: the request is forwarded to the computer and its answer is returned unchanged, cookie
// included. On the computer the variable is not set, so the same routes answer themselves and use the local file
// store. When the computer is off, the routes reply 503 `backend_offline` and the site keeps working without login.
const BACKEND = (process.env.NEXT_PUBLIC_BACKEND_URL || "").replace(/\/$/, "");

export const usesRemoteBackend = () => Boolean(BACKEND);

export async function proxyIfRemote(req: Request): Promise<Response | null> {
  if (!BACKEND) return null;
  const url = new URL(req.url);
  const headers = new Headers();
  for (const name of ["cookie", "content-type", "accept", "accept-language"]) {
    const v = req.headers.get(name);
    if (v) headers.set(name, v);
  }
  // ngrok's free plan shows an HTML warning page to browser-like requests unless this header is present.
  headers.set("ngrok-skip-browser-warning", "1");
  try {
    const res = await fetch(`${BACKEND}${url.pathname}${url.search}`, {
      method: req.method,
      headers,
      body: req.method === "GET" || req.method === "HEAD" ? undefined : await req.text(),
      redirect: "manual",
      cache: "no-store",
      signal: AbortSignal.timeout(8000),
    });
    const out = new Headers();
    out.set("x-served-by", "owner-computer"); // lets a human (or a test) tell the answer came from the backend
    const type = res.headers.get("content-type");
    if (type) out.set("content-type", type);
    for (const c of res.headers.getSetCookie()) out.append("set-cookie", c);
    return new Response(await res.arrayBuffer(), { status: res.status, headers: out });
  } catch {
    return Response.json({ error: "backend_offline" }, { status: 503 });
  }
}
