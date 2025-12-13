export default async function handler(req, res) {
  if (req.method === "GET") return res.status(200).send("Webhook alive. Use POST.");
  if (req.method !== "POST") return res.status(405).end();

  if (req.query.secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ ok: false, error: "unauthorized" });
  }

  const payload = {
    ...req.body,
    updatedAt: Date.now(),
  };

  const latestKey = "signal:latest";
  const listKey = "signal:history";

  // 1) set latest
  const setUrl = `${process.env.UPSTASH_REDIS_REST_URL}/set/${encodeURIComponent(latestKey)}`;
  const r1 = await fetch(setUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  // 2) push history (LPUSH) + trim to 10 (LTRIM)
  const lpushUrl = `${process.env.UPSTASH_REDIS_REST_URL}/lpush/${encodeURIComponent(listKey)}`;
  const r2 = await fetch(lpushUrl, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const ltrimUrl = `${process.env.UPSTASH_REDIS_REST_URL}/ltrim/${encodeURIComponent(listKey)}/0/9`;
  const r3 = await fetch(ltrimUrl, {
    headers: { Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}` },
  });

  if (!r1.ok || !r2.ok || !r3.ok) {
    const t1 = await r1.text().catch(() => "");
    const t2 = await r2.text().catch(() => "");
    const t3 = await r3.text().catch(() => "");
    return res.status(500).json({ ok: false, upstash: { set: t1, lpush: t2, ltrim: t3 } });
  }

  return res.json({ ok: true });
}
