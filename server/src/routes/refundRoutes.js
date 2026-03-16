/**
 * Refund API routes: analyze-refund, tickets, analytics.
 * All require store API key.
 */

import { Router } from 'express';
import { requireStoreAuth } from '../middleware/authMiddleware.js';
import * as refundController from '../controllers/refundController.js';

const router = Router();

router.post('/analyze-refund', requireStoreAuth, refundController.analyzeRefund);
router.get('/tickets', requireStoreAuth, refundController.getTickets);
router.get('/analytics', requireStoreAuth, refundController.getAnalytics);

export const refundRoutes = router;
