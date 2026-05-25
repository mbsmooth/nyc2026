import express from 'express';
import fetch from 'node-fetch';

const router = express.Router();

// GET /api/places/search?lat=40.72&lng=-74.01&keyword=burger&radius=500
router.get('/search', async (req, res) => {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  if (!apiKey || apiKey === 'your_key_here') {
    return res.status(503).json({ error: 'Google Places API key not configured' });
  }

  const { lat, lng, keyword = 'restaurant', radius = 800 } = req.query;
  if (!lat || !lng) return res.status(400).json({ error: 'lat and lng are required' });

  const url = new URL('https://maps.googleapis.com/maps/api/place/nearbysearch/json');
  url.searchParams.set('location', `${lat},${lng}`);
  url.searchParams.set('radius', radius);
  url.searchParams.set('type', 'restaurant');
  url.searchParams.set('keyword', keyword);
  url.searchParams.set('key', apiKey);

  try {
    const response = await fetch(url.toString());
    const data = await response.json();
    if (data.status !== 'OK' && data.status !== 'ZERO_RESULTS') {
      return res.status(502).json({ error: data.status, details: data.error_message });
    }
    const results = (data.results || []).slice(0, 8).map(p => ({
      placeId: p.place_id,
      name: p.name,
      address: p.vicinity,
      rating: p.rating,
      totalRatings: p.user_ratings_total,
      priceLevel: p.price_level,
      openNow: p.opening_hours?.open_now,
      photoRef: p.photos?.[0]?.photo_reference ?? null,
      mapsUrl: `https://www.google.com/maps/place/?q=place_id:${p.place_id}`,
    }));
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
