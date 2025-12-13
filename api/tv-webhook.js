import { setLatestSignal } from "./signal.js";

export default async function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).send("Webhook is alive. Use POST.");
  }
  if (req.method !== "POST") return res.status(405).end();

  const secret = req.query.secret;
  if (secret !== process.env.WEBHOOK_SECRET) {
    return res.status(401).json({ ok: false });
  }

  // LƯU SIGNAL MỚI NHẤT
  setLatestSignal({ ...req.body, updatedAt: Date.now() });

  return res.json({ ok: true });
}
