import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  mealId:    { type: String, required: true },
  name:      { type: String, required: true },
  address:   { type: String, default: '' },
  rating:    { type: Number },
  mapsUrl:   { type: String, default: '' },
  addedBy:   { type: String, required: true },
  placeId:   { type: String },
  createdAt: { type: Date, default: Date.now },
});

schema.index({ mealId: 1, createdAt: 1 });

export default mongoose.model('MealOption', schema);
