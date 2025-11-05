import mongoose from 'mongoose';
import Event, { EVENT_STATUS } from '../models/Event.js';
import SwapRequest, { SWAP_STATUS } from '../models/SwapRequest.js';


export const getSwappableSlots = async (req, res) => {
  const list = await Event.find({
    status: EVENT_STATUS.SWAPPABLE,
    userId: { $ne: req.user._id }
  }).sort({ startTime: 1 });

  res.json(list);
};

export const createSwapRequest = async (req, res) => {
  const { mySlotId, theirSlotId } = req.body || {};
  if (!mySlotId || !theirSlotId) return res.status(400).json({ message: 'mySlotId and theirSlotId required' });

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const mySlot = await Event.findOneAndUpdate(
        { _id: mySlotId, userId: req.user._id, status: EVENT_STATUS.SWAPPABLE },
        { $set: { status: EVENT_STATUS.SWAP_PENDING } },
        { new: true, session }
      );
      if (!mySlot) throw new Error('Your slot not found or not swappable');

      const theirSlot = await Event.findOneAndUpdate(
        { _id: theirSlotId, status: EVENT_STATUS.SWAPPABLE, userId: { $ne: req.user._id } },
        { $set: { status: EVENT_STATUS.SWAP_PENDING } },
        { new: true, session }
      );
      if (!theirSlot) throw new Error('Their slot not found or not swappable');

      const swap = await SwapRequest.create(
        [{
          requesterId: req.user._id,
          responderId: theirSlot.userId,
          mySlotId: mySlot._id,
          theirSlotId: theirSlot._id,
          status: SWAP_STATUS.PENDING
        }],
        { session }
      );

      res.status(201).json(swap[0]);
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
};


export const respondToSwap = async (req, res) => {
  const { requestId } = req.params;
  const { accept } = req.body || {};
  if (accept === undefined) return res.status(400).json({ message: 'accept (boolean) required' });

  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const swap = await SwapRequest.findOne({ _id: requestId, responderId: req.user._id, status: SWAP_STATUS.PENDING }).session(session);
      if (!swap) throw new Error('Swap request not found or already handled');

      const mySlot = await Event.findById(swap.mySlotId).session(session);
      const theirSlot = await Event.findById(swap.theirSlotId).session(session);
      if (!mySlot || !theirSlot) throw new Error('One or both slots missing');

      if (mySlot.status !== EVENT_STATUS.SWAP_PENDING || theirSlot.status !== EVENT_STATUS.SWAP_PENDING) {
        throw new Error('Slots not in SWAP_PENDING state');
      }

      if (!accept) {
        await Event.updateOne({ _id: mySlot._id }, { $set: { status: EVENT_STATUS.SWAPPABLE } }, { session });
        await Event.updateOne({ _id: theirSlot._id }, { $set: { status: EVENT_STATUS.SWAPPABLE } }, { session });
        swap.status = SWAP_STATUS.REJECTED;
        await swap.save({ session });
        return res.json({ status: 'REJECTED' });
      }

      const requesterId = swap.requesterId;
      const responderId = swap.responderId;

      if (!mySlot.userId.equals(requesterId)) throw new Error('Ownership mismatch for requester slot');
      if (!theirSlot.userId.equals(responderId)) throw new Error('Ownership mismatch for responder slot');

      await Event.updateOne({ _id: mySlot._id }, { $set: { userId: responderId, status: EVENT_STATUS.BUSY } }, { session });
      await Event.updateOne({ _id: theirSlot._id }, { $set: { userId: requesterId, status: EVENT_STATUS.BUSY } }, { session });

      swap.status = SWAP_STATUS.ACCEPTED;
      await swap.save({ session });

      res.json({ status: 'ACCEPTED' });
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  } finally {
    session.endSession();
  }
};


export const getRequests = async (req, res) => {
  const [incoming, outgoing] = await Promise.all([
    SwapRequest.find({ responderId: req.user._id }).sort({ createdAt: -1 }).lean(),
    SwapRequest.find({ requesterId: req.user._id }).sort({ createdAt: -1 }).lean(),
  ]);
  res.json({ incoming, outgoing });
};
