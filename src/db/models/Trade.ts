import mongoose from 'mongoose';
import './User';

const TradeBookSubSchema = new mongoose.Schema(
  {
    title: { type: String },
    author: { type: String },
    ownerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  { _id: false }
);

const TradeSchema = new mongoose.Schema(
  {
    fromUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    toUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    bookGiven: { type: TradeBookSubSchema, required: true },
    bookTaken: { type: TradeBookSubSchema, required: true }
  },
  { timestamps: true }
);

export default mongoose.models.Trade || mongoose.model('Trade', TradeSchema);
