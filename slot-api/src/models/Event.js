import mongoose from 'mongoose';

export const EVENT_STATUS = {
  BUSY: 'BUSY',
  SWAPPABLE: 'SWAPPABLE',
  SWAP_PENDING: 'SWAP_PENDING',
};

const eventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: {
      type: String,
      enum: Object.values(EVENT_STATUS),
      default: EVENT_STATUS.BUSY,
      index: true
    },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  },
  { timestamps: true }
);

eventSchema.path('endTime').validate(function (value) {
  return value > this.startTime;
}, 'endTime must be after startTime');

export default mongoose.model('Event', eventSchema);
