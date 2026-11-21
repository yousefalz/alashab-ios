// «العشّاب» — عداد مجهول: كل جهاز له رقم عشوائي يسويه التطبيق (بدون اسم ولا إيميل ولا موقع)
import { getStore } from "@netlify/blobs";
export const config = { path: "/api/ping" };
const ok = s => typeof s === "string" && /^[A-Za-z0-9-]{8,64}$/.test(s);
export default async (req) => {
  if (req.method !== "POST") return new Response("", { status: 405 });
  let b; try { b = await req.json(); } catch { return new Response("", { status: 400 }); }
  if (!ok(b.id)) return new Response("", { status: 400 });
  const ev = b.e === "scan" ? "scan" : "open";
  const s = getStore("alashab");
  const day = new Date().toISOString().slice(0, 10);
  await s.set(`dev/${b.id}`, "1", { onlyIfNew: true });
  await s.set(`day/${day}/${b.id}`, "1", { onlyIfNew: true });
  if (ev === "scan") await s.set(`scan/${day}/${b.id}-${Date.now()}`, "1");
  return new Response("ok");
};
