import mongoose from 'mongoose';

const suggestionSchema = new mongoose.Schema({
  traveler: { type: String, required: true },
  type: { type: String, enum: ['restaurant', 'activity', 'other'], default: 'restaurant' },
  name: { type: String, required: true },
  location: String,
  notes: String,
  day: String,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Suggestion', suggestionSchema);
