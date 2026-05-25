import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import votesRouter from './routes/votes.js';
import placesRouter from './routes/places.js';
import suggestionsRouter from './routes/suggestions.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB — app works without it (votes/suggestions just won't persist)
if (process.env.MONGO_URI) {
  mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.warn('MongoDB unavailable — running without persistence:', err.message));
}

app.use('/api/votes', votesRouter);
app.use('/api/places', placesRouter);
app.use('/api/suggestions', suggestionsRouter);

app.get('/api/health', (_req, res) => res.json({ ok: true }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
