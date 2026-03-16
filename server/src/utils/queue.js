/**
 * BullMQ queue for refund processing.
 * Webhook → Queue → Worker → AI → Database
 */

import { Queue } from 'bullmq';
import { logger } from './logger.js';

const connection = process.env.REDIS_URL || {
  host: process.env.REDIS_HOST ?? 'localhost',
  port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
};

export const refundQueue = new Queue('refund-analysis', {
  connection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: 'exponential', delay: 1000 },
    removeOnComplete: { count: 1000 },
  },
});

/**
 * Add a refund request to the queue for async processing.
 * @param {Object} data - { ticketId, storeId, customerMessage, orderData, policyText }
 */
export async function addRefundJob(data) {
  const job = await refundQueue.add('analyze', data, {
    jobId: data.ticketId,
  });
  logger.info('Refund job queued', { jobId: job.id, storeId: data.storeId });
  return job;
}
