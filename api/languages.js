export default async function handler(req, res) {
  // ✅ Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const { sl, dl, text } = req.query;
  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;

  if (pathname === "/api/languages") {
    try {
      const response = await fetch("https://ftapi.pythonanywhere.com/languages");
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch language list" });
    }
  }

  if (pathname === "/api/translate") {
    if (!dl || !text) {
      return res.status(400).json({ error: "Missing required parameters: dl and text" });
    }
    
    const apiUrl = sl
      ? `https://ftapi.pythonanywhere.com/translate?sl=${sl}&dl=${dl}&text=${encodeURIComponent(text)}`
      : `https://ftapi.pythonanywhere.com/translate?dl=${dl}&text=${encodeURIComponent(text)}`;
    
    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: "Failed to translate text" });
    }
  }
  
  return res.status(404).json({ error: "Endpoint not found" });
}
