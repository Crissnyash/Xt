const express = require('express');
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// === Deezer Proxy Endpoint ===
app.get('/api/deezer', async (req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch('https://api.deezer.com/chart/0/tracks?limit=5', { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      console.error(`[Deezer] API error: ${response.status} ${response.statusText}`);
      throw new Error(`Deezer API error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    res.json({ success: true, source: 'deezer', data });
  } catch (error) {
    console.error('[Deezer] Fetch failed:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch Deezer data.', details: error.message });
  }
});

// === Dailymotion Proxy Endpoint ===
app.get('/api/dailymotion', async (req, res) => {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch('https://api.dailymotion.com/videos?fields=title,embed_url,thumbnail_url&search=music%20video&limit=3&sort=recent', { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      console.error(`[Dailymotion] API error: ${response.status} ${response.statusText}`);
      throw new Error(`Dailymotion API error ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    res.json({ success: true, source: 'dailymotion', data });
  } catch (error) {
    console.error('[Dailymotion] Fetch failed:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch Dailymotion data.', details: error.message });
  }
});

// === Root homepage route ===
app.get('/', (req, res) => {
  res.send(`
    <h1>🎵 Proxy Server is Running!</h1>
    <p>Available API endpoints:</p>
    <ul>
      <li><a href="/api/deezer">/api/deezer</a> - Get top 5 tracks from Deezer</li>
      <li><a href="/api/dailymotion">/api/dailymotion</a> - Get 3 recent music videos from Dailymotion</li>
    </ul>
  `);
});

// === Start the server ===
app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
});
