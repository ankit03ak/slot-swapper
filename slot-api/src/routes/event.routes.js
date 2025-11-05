import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import {
  createEvent,
  getMyEvents,
  getEventById,
  updateEvent,
  deleteEvent
} from '../controllers/event.controller.js';

const router = Router();

router.use(auth);
router.post('/', createEvent);
router.get('/', getMyEvents);
router.get('/:id', getEventById);
router.put('/:id', updateEvent);
router.delete('/:id', deleteEvent);

export default router;
