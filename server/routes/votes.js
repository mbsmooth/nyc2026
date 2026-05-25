import express from 'express';
import Vote from '../models/Vote.js';

const router = express.Router();

// GET /api/votes/:mealId — tally for a meal
router.get('/:mealId', async (req, res) => {
  try {
    const votes = await Vote.find({ mealId: req.params.mealId });
    const tally = {};
    votes.forEach(v => {
      tally[v.optionIndex] = (tally[v.optionIndex] || 0) + 1;
    });
    // also return per-traveler picks so UI can show who picked what
    const byTraveler = {};
    votes.forEach(v => { byTraveler[v.traveler] = v.optionIndex; });
    res.json({ tally, byTraveler });
  } catch {
    res.json({ tally: {}, byTraveler: {} });
  }
});

// GET /api/votes — all votes (for dashboard summary)
router.get('/', async (_req, res) => {
  try {
    const votes = await Vote.find({});
    const byMeal = {};
    votes.forEach(v => {
      if (!byMeal[v.mealId]) byMeal[v.mealId] = { tally: {}, byTraveler: {} };
      byMeal[v.mealId].tally[v.optionIndex] = (byMeal[v.mealId].tally[v.optionIndex] || 0) + 1;
      byMeal[v.mealId].byTraveler[v.traveler] = v.optionIndex;
    });
    res.json(byMeal);
  } catch {
    res.json({});
  }
});

// POST /api/votes — cast or update a vote
router.post('/', async (req, res) => {
  const { mealId, optionIndex, traveler } = req.body;
  if (!mealId || optionIndex === undefined || !traveler) {
    return res.status(400).json({ error: 'mealId, optionIndex, and traveler are required' });
  }
  try {
    await Vote.findOneAndUpdate(
      { mealId, traveler },
      { optionIndex },
      { upsert: true, new: true }
    );
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE /api/votes/:mealId/:traveler — remove a vote
router.delete('/:mealId/:traveler', async (req, res) => {
  try {
    await Vote.deleteOne({ mealId: req.params.mealId, traveler: req.params.traveler });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
