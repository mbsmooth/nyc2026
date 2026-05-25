import express from 'express';
import ActivityLog from '../models/ActivityLog.js';

const router = express.Router();

router.get('/', async (_req, res) => {
  try {
    const logs = await ActivityLog.find().sort({ ts: -1 }).limit(200);
    res.json(logs);
  } catch {
    res.json([]);
  }
});

router.post('/', async (req, res) => {
  const { traveler, action, detail } = req.body;
  if (!traveler || !action) return res.status(400).json({ error: 'traveler and action required' });
  try {
    const log = await ActivityLog.create({ traveler, action, detail });
    res.status(201).json(log);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
