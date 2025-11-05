import mongoose from 'mongoose';
import { EVENT_STATUS } from './Event.js';

export const SWAP_STATUS = {
  PENDING: 'PENDING',
  ACCEPTED: 'ACCEPTED',
  REJECTED: 'REJECTED',
  CANCELLED: 'CANCELLED'
};

const swapRequestSchema = new mongoose.Schema(
  {
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    responderId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    mySlotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },     // requester's slot
    theirSlotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },  // responder's slot
    status: { type: String, enum: Object.values(SWAP_STATUS), default: SWAP_STATUS.PENDING },
  },
  { timestamps: true }
);

swapRequestSchema.index({ responderId: 1, status: 1 });
swapRequestSchema.index({ requesterId: 1, status: 1 });

export default mongoose.model('SwapRequest', swapRequestSchema);
