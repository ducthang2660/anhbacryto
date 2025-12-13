let latestSignal = null;

export function setLatestSignal(data) {
  latestSignal = data;
}

export default function handler(req, res) {
  if (req.method === "GET") {
    return res.status(200).json(latestSignal || { empty: true });
  }
  return res.status(405).end();
}
