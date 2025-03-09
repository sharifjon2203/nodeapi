const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

app.get('/proxy/languages', async (req, res) => {
  try {
    const response = await fetch('https://ftapi.pythonanywhere.com/languages');
    const data = await response.json();
    res.json(data);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch data" });
  }
});

app.listen(3000, () => console.log('Proxy server running on port 3000'));
