import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  campaign: { type: mongoose.Schema.Types.ObjectId, ref: 'Campaign', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  screenshotUrl: { type: String, required: true },
  verified: { type: Boolean, default: false },
  rejected: { type: Boolean, default: false },
  receiptUrl: { type: String }, // ✅ New field for receipt PDF path
}, { timestamps: true });

export default mongoose.model('Payment', paymentSchema);
