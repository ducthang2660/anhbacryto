export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).end();
  }

  const secret = req.query.secret;
  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ ok: false });
  }

  console.log("TradingView signal:", req.body);
  return res.json({ ok: true });
}
