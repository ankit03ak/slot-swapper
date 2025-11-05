import Event, { EVENT_STATUS } from '../models/Event.js';

export const createEvent = async (req, res) => {
  const { title, startTime, endTime, status } = req.body || {};
  if (!title || !startTime || !endTime) return res.status(400).json({ message: 'title, startTime, endTime required' });

  const ev = await Event.create({
    title,
    startTime,
    endTime,
    status: status || EVENT_STATUS.BUSY,
    userId: req.user._id,
  });
  res.status(201).json(ev);
};

export const getMyEvents = async (req, res) => {
  const events = await Event.find({ userId: req.user._id }).sort({ startTime: 1 });
  res.json(events);
};

export const getEventById = async (req, res) => {
  const ev = await Event.findOne({ _id: req.params.id, userId: req.user._id });
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  res.json(ev);
};

export const updateEvent = async (req, res) => {
  const update = {};
  ['title', 'startTime', 'endTime', 'status'].forEach((k) => {
    if (req.body?.[k] !== undefined) update[k] = req.body[k];
  });

  const ev = await Event.findOneAndUpdate(
    { _id: req.params.id, userId: req.user._id },
    { $set: update },
    { new: true }
  );
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  res.json(ev);
};

export const deleteEvent = async (req, res) => {
  const ev = await Event.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!ev) return res.status(404).json({ message: 'Event not found' });
  res.json({ ok: true });
};
