import mongoose from 'mongoose';

const campaignSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  shortDescription: String,
  thumbnail: String,
  images: [String],
  targetAmount: { type: Number, required: true },
  collectedAmount: { type: Number, default: 0 },

  // Payment fields moved here directly
  qrCode: String,
  upi: String,
  bank: String,

  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

export default mongoose.model('Campaign', campaignSchema);
