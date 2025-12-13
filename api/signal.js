export default async function handler(req, res) {
  const key = "signal:latest";
  const url = `${process.env.UPSTASH_REDIS_REST_URL}/get/${encodeURIComponent(key)}`;

  const r = await fetch(url, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
  });

  if (!r.ok) return res.status(200).json({ empty: true });

  const j = await r.json(); // { result: ... }
  let result = j.result;

  // ✅ Upstash đôi khi trả result dạng string JSON → parse sang object
  if (typeof result === "string") {
    try { result = JSON.parse(result); } catch {}
  }

  return res.status(200).json(result || { empty: true });
}
