export default async function handler(req, res) {
  // ✅ Enable CORS
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  // Handle preflight OPTIONS request
  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const pathname = new URL(req.url, `http://${req.headers.host}`).pathname;

  // Handle /api/languages
  if (pathname === "/api/languages") {
    if (req.method !== "GET") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    try {
      const response = await fetch("https://ftapi.pythonanywhere.com/languages");
      if (!response.ok) throw new Error("Language fetch failed");
      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      return res.status(500).json({ error: "Failed to fetch language list" });
    }
  }

  // Handle /api/translate
  if (pathname === "/api/translate") {
    if (!["GET", "POST"].includes(req.method)) {
      return res.status(405).json({ error: "Method not allowed" });
    }

    let params;
    if (req.method === "GET") {
      params = req.query;
    } else if (req.method === "POST") {
      if (!req.headers["content-type"]?.includes("application/json")) {
        return res.status(415).json({ error: "Unsupported media type" });
      }
      params = req.body;
    }

    const { sl, dl, text } = params || {};

    if (!dl || !text) {
      return res.status(400).json({ 
        error: "Missing required parameters: dl and text",
        received: { dl, text }
      });
    }

    try {
      const apiParams = new URLSearchParams();
      if (sl) apiParams.append("sl", sl);
      apiParams.append("dl", dl);
      apiParams.append("text", text);

      const apiUrl = `https://ftapi.pythonanywhere.com/translate?${apiParams.toString()}`;
      const response = await fetch(apiUrl);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Translation failed: ${errorText}`);
      }

      const data = await response.json();
      return res.status(200).json(data);
    } catch (err) {
      console.error("Translation error:", err);
      return res.status(500).json({ 
        error: "Failed to translate text",
        details: err.message 
      });
    }
  }

  return res.status(404).json({ error: "Endpoint not found" });
}

// Enable body parsing for POST requests
export const config = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
  },
};