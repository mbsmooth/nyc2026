import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  traveler: { type: String, required: true },
  action:   { type: String, required: true }, // 'login' | 'vote' | 'suggest'
  detail:   { type: String, default: '' },
  ts:       { type: Date, default: Date.now },
});

schema.index({ ts: -1 });

export default mongoose.model('ActivityLog', schema);
