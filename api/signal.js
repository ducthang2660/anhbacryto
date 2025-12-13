export default async function handler(req, res) {
  const key = "signal:latest";

  const r = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/get/${encodeURIComponent(key)}`,
    {
      headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` }
    }
  );

  const j = await r.json(); // { result: ... }
  return res.status(200).json(j.result || { empty: true });
}
