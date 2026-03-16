/**
 * Refund controller: analyze-refund, tickets, analytics.
 */

import { z } from 'zod';
import * as refundService from '../services/refundService.js';

const analyzeRefundSchema = z.object({
  customer_message: z.string().min(1, 'Customer message is required'),
  order_data: z.record(z.unknown()).optional(),
  async: z.boolean().optional(),
});

export async function analyzeRefund(req, res, next) {
  try {
    const parsed = analyzeRefundSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }
    const storeId = req.store.id;
    const { ticket, analysis, queued } = await refundService.createTicket(
      storeId,
      parsed.data,
      { async: parsed.data.async }
    );
    if (queued) {
      return res.status(202).json({ ticketId: ticket.id, message: 'Analysis queued.' });
    }
    res.status(200).json({
      ticketId: ticket.id,
      decision: ticket.decision,
      policy_clause: ticket.policyClause,
      reason: ticket.reason,
      response_message: ticket.aiResponse,
      alternative_offer: ticket.alternativeOffer,
    });
  } catch (err) {
    next(err);
  }
}

export async function getTickets(req, res, next) {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit, 10) : 50;
    const tickets = await refundService.getTickets(req.store.id, limit);
    res.json({ tickets });
  } catch (err) {
    next(err);
  }
}

export async function getAnalytics(req, res, next) {
  try {
    const analytics = await refundService.getAnalytics(req.store.id);
    res.json(analytics);
  } catch (err) {
    next(err);
  }
}
