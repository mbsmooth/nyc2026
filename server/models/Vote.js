import mongoose from 'mongoose';

const voteSchema = new mongoose.Schema({
  mealId: { type: String, required: true },
  optionIndex: { type: Number, required: true },
  traveler: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// One vote per traveler per meal — upsert on change
voteSchema.index({ mealId: 1, traveler: 1 }, { unique: true });

export default mongoose.model('Vote', voteSchema);
