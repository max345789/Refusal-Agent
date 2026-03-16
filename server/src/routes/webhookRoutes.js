/**
 * Webhook routes. Shopify refund-request creates a ticket and optionally queues analysis.
 */

import { Router } from 'express';
import { z } from 'zod';
import { requireStoreAuth } from '../middleware/authMiddleware.js';
import * as refundService from '../services/refundService.js';
import { logger } from '../utils/logger.js';

const router = Router();

const shopifyRefundBodySchema = z.object({
  customer_message: z.string().min(1, 'Customer message is required'),
  order_data: z.record(z.unknown()).optional(),
  async: z.boolean().optional(),
});

/**
 * POST /api/webhooks/shopify/refund-request
 * Uses X-API-Key to identify store. Creates ticket and runs analysis (sync or async).
 */
router.post('/shopify/refund-request', requireStoreAuth, async (req, res, next) => {
  try {
    const parsed = shopifyRefundBodySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }
    logger.info('Webhook: Shopify refund-request', { storeId: req.store.id });

    const { ticket, queued } = await refundService.createTicket(
      req.store.id,
      parsed.data,
      { async: parsed.data.async ?? true }
    );

    if (queued) {
      return res.status(202).json({ ticketId: ticket.id, message: 'Refund request queued for analysis.' });
    }
    res.status(200).json({
      ticketId: ticket.id,
      decision: ticket.decision,
      response_message: ticket.aiResponse,
      alternative_offer: ticket.alternativeOffer,
    });
  } catch (err) {
    next(err);
  }
});

export const webhookRoutes = router;
