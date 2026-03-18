/**
 * BullMQ queue for refund processing.
 * Webhook → Queue → Worker → AI → Database
 */

import { Queue } from 'bullmq';
import { logger } from './logger.js';

// Disable queue entirely when no REDIS_URL provided (avoids localhost connect).
const hasRedis = Boolean(process.env.REDIS_URL);

export const refundQueue = hasRedis
  ? new Queue('refund-analysis', {
      connection: process.env.REDIS_URL,
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 1000 },
        removeOnComplete: { count: 1000 },
      },
    })
  : null;

/**
 * Add a refund request to the queue for async processing.
 * @param {Object} data - { ticketId, storeId, customerMessage, orderData, policyText }
 */
export async function addRefundJob(data) {
  if (!refundQueue) {
    logger.warn('Queue disabled: REDIS_URL not set');
    return null;
  }
  const job = await refundQueue.add('analyze', data, {
    jobId: data.ticketId,
  });
  logger.info('Refund job queued', { jobId: job.id, storeId: data.storeId });
  return job;
}
