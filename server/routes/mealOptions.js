import express from 'express';
import MealOption from '../models/MealOption.js';

const router = express.Router();

router.get('/:mealId', async (req, res) => {
  try {
    const opts = await MealOption.find({ mealId: req.params.mealId }).sort({ createdAt: 1 });
    res.json(opts);
  } catch {
    res.json([]);
  }
});

router.post('/', async (req, res) => {
  const { mealId, name, address, rating, mapsUrl, addedBy, placeId } = req.body;
  if (!mealId || !name || !addedBy) {
    return res.status(400).json({ error: 'mealId, name, addedBy required' });
  }
  try {
    if (placeId) {
      const existing = await MealOption.findOne({ mealId, placeId });
      if (existing) return res.status(409).json({ error: 'Already added' });
    }
    const opt = await MealOption.create({ mealId, name, address, rating, mapsUrl, addedBy, placeId });
    res.status(201).json(opt);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await MealOption.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
