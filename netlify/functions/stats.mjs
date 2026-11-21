// «العشّاب» — إحصائيات العداد السري (للمطوّر بس، بالمفتاح)
import { getStore } from "@netlify/blobs";
import { createHash } from "node:crypto";
const KEY_HASH = "3ff901de32cb393e807e12c0598552696979a926e77a21ebf5c78d03eaa356b1";
export const config = { path: "/api/stats" };
export default async (req) => {
  const k = new URL(req.url).searchParams.get("k") || "";
  if (createHash("sha256").update(k).digest("hex") !== KEY_HASH) return new Response("", { status: 403 });
  const s = getStore({ name: "alashab", consistency: "strong" });
  const n = async p => (await s.list({ prefix: p })).blobs.length;
  const d = i => new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
  const week = new Set();
  for (let i = 0; i < 7; i++) for (const x of (await s.list({ prefix: `day/${d(i)}/` })).blobs) week.add(x.key.split("/").pop());
  let scans7 = 0; for (let i = 0; i < 7; i++) scans7 += await n(`scan/${d(i)}/`);
  const body = { devices: await n("dev/"), today: await n(`day/${d(0)}/`), week: week.size, scansToday: await n(`scan/${d(0)}/`), scans7, at: new Date().toISOString() };
  return Response.json(body, { headers: { "cache-control": "no-store" } });
};
