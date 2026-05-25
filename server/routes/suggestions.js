import express from 'express';
import Suggestion from '../models/Suggestion.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const suggestions = await Suggestion.find({}).sort({ createdAt: -1 });
    res.json(suggestions);
  } catch {
    res.json([]);
  }
});

router.post('/', async (req, res) => {
  const { traveler, type, name, location, notes, day } = req.body;
  if (!traveler || !name) {
    return res.status(400).json({ error: 'traveler and name are required' });
  }
  try {
    const s = await Suggestion.create({ traveler, type, name, location, notes, day });
    res.status(201).json(s);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    await Suggestion.findByIdAndDelete(req.params.id);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
