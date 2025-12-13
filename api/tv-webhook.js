export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  if (req.query.secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ ok: false });
  }

  const payload = { ...req.body, updatedAt: Date.now() };
  const key = "signal:latest";

  const r = await fetch(
    `${process.env.UPSTASH_REDIS_REST_URL}/set/${encodeURIComponent(key)}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    }
  );

  // 👇 thêm dòng này để biết Upstash có fail không
  const txt = await r.text();
  if (!r.ok) return res.status(500).json({ ok: false, upstash: txt });

  return res.json({ ok: true, upstash: txt });
}
