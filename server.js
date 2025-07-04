const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Proxy for Deezer tracks
app.get('/api/deezer', async (req, res) => {
  try {
    const response = await fetch('https://api.deezer.com/chart/0/tracks?limit=5');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Deezer data.' });
  }
});

// Proxy for Dailymotion videos
app.get('/api/dailymotion', async (req, res) => {
  try {
    const response = await fetch('https://api.dailymotion.com/videos?fields=title,embed_url,thumbnail_url&search=music%20video&limit=3&sort=recent');
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch Dailymotion data.' });
  }
});

app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
});
