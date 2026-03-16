/**
 * Refund ticket and analysis service.
 * Creates tickets, runs AI analysis, and enqueues webhook jobs.
 */

import { prisma } from '../database/prisma.js';
import { analyzeRefund } from '../ai/refundAnalyzer.js';
import { addRefundJob } from '../utils/queue.js';
import { logger } from '../utils/logger.js';

/**
 * Create a ticket and optionally run analysis sync or async.
 */
export async function createTicket(storeId, { customer_message, order_data }, { async: useQueue = false } = {}) {
  const store = await prisma.store.findUnique({ where: { id: storeId } });
  if (!store) {
    throw new Error('Store not found');
  }

  const ticket = await prisma.ticket.create({
    data: {
      storeId,
      customerMessage: customer_message,
      orderData: order_data ?? undefined,
    },
  });

  if (useQueue) {
    await addRefundJob({
      ticketId: ticket.id,
      storeId,
      customerMessage: customer_message,
      orderData: order_data ?? {},
      policyText: store.policyText,
    });
    return { ticket, queued: true };
  }

  const analysis = await analyzeRefund({
    customer_message,
    store_policy: store.policyText,
    order_data: order_data ?? {},
  });

  const updated = await prisma.ticket.update({
    where: { id: ticket.id },
    data: {
      decision: analysis.decision,
      policyClause: analysis.policy_clause,
      reason: analysis.reason,
      aiResponse: analysis.response_message,
      alternativeOffer: analysis.alternative_offer,
    },
  });

  return { ticket: updated, analysis };
}

/**
 * Get tickets for a store with optional limit.
 */
export async function getTickets(storeId, limit = 50) {
  return prisma.ticket.findMany({
    where: { storeId },
    orderBy: { createdAt: 'desc' },
    take: Math.min(Number(limit) || 50, 100),
    select: {
      id: true,
      customerMessage: true,
      aiResponse: true,
      decision: true,
      policyClause: true,
      reason: true,
      alternativeOffer: true,
      createdAt: true,
    },
  });
}

/**
 * Get analytics summary for a store (counts by decision, recent volume).
 */
export async function getAnalytics(storeId) {
  const [total, approved, denied, last24h] = await Promise.all([
    prisma.ticket.count({ where: { storeId } }),
    prisma.ticket.count({ where: { storeId, decision: 'approve' } }),
    prisma.ticket.count({ where: { storeId, decision: 'deny' } }),
    prisma.ticket.count({
      where: {
        storeId,
        createdAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  return {
    totalTickets: total,
    approved,
    denied,
    pending: total - approved - denied,
    last24Hours: last24h,
  };
}

/**
 * Process a single ticket with AI (used by worker).
 */
export async function processTicketWithAI(ticketId, storeId, customerMessage, orderData, policyText) {
  const analysis = await analyzeRefund({
    customer_message: customerMessage,
    store_policy: policyText,
    order_data: orderData ?? {},
  });

  await prisma.ticket.update({
    where: { id: ticketId },
    data: {
      decision: analysis.decision,
      policyClause: analysis.policy_clause,
      reason: analysis.reason,
      aiResponse: analysis.response_message,
      alternativeOffer: analysis.alternative_offer,
    },
  });

  logger.info('Ticket processed', { ticketId, decision: analysis.decision });
  return analysis;
}
