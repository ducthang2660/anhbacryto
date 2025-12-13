export default async function handler(req, res) {
  const key = "signal:history";
  const url = `${process.env.UPSTASH_REDIS_REST_URL}/lrange/${encodeURIComponent(key)}/0/9`;

  const r = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
  });

  if (!r.ok) return res.status(200).json({ items: [] });

  const j = await r.json(); // { result: [...] }
  const arr = Array.isArray(j.result) ? j.result : [];

  const items = arr.map((x) => {
    if (typeof x === "string") {
      try { return JSON.parse(x); } catch { return { raw: x }; }
    }
    return x;
  });

  return res.status(200).json({ items });
}
