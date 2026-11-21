// «العشّاب» — إحصائيات العداد السري (للمطوّر بس، بالمفتاح)
import { getStore } from "@netlify/blobs";
export const config = { path: "/api/stats" };
export default async (req) => {
  const k = new URL(req.url).searchParams.get("k") || "";
  if (!process.env.ALASHAB_STATS_KEY || k !== process.env.ALASHAB_STATS_KEY) return new Response("", { status: 403 });
  const s = getStore({ name: "alashab", consistency: "strong" });
  const n = async p => (await s.list({ prefix: p })).blobs.length;
  const d = i => new Date(Date.now() - i * 864e5).toISOString().slice(0, 10);
  const week = new Set();
  for (let i = 0; i < 7; i++) for (const x of (await s.list({ prefix: `day/${d(i)}/` })).blobs) week.add(x.key.split("/").pop());
  let scans7 = 0; for (let i = 0; i < 7; i++) scans7 += await n(`scan/${d(i)}/`);
  const body = { devices: await n("dev/"), today: await n(`day/${d(0)}/`), week: week.size, scansToday: await n(`scan/${d(0)}/`), scans7, at: new Date().toISOString() };
  return Response.json(body, { headers: { "cache-control": "no-store" } });
};
