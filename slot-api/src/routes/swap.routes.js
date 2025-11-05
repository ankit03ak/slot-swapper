import { Router } from 'express';
import { auth } from '../middleware/auth.js';
import {
  getSwappableSlots,
  createSwapRequest,
  respondToSwap,
  getRequests
} from '../controllers/swap.controller.js';

const router = Router();

router.use(auth);
router.get('/swappable-slots', getSwappableSlots);
router.post('/swap-request', createSwapRequest);
router.post('/swap-response/:requestId', respondToSwap);
router.get('/requests', getRequests);

export default router;
