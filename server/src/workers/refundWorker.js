/**
 * BullMQ worker: processes refund-analysis queue.
 * Flow: Webhook → Queue → Worker → AI → Database
 */

import 'dotenv/config';
import { Worker } from 'bullmq';
import { processTicketWithAI } from '../services/refundService.js';
import { logger } from '../utils/logger.js';

const connection = process.env.REDIS_URL || {
  host: process.env.REDIS_HOST ?? 'localhost',
  port: parseInt(process.env.REDIS_PORT ?? '6379', 10),
};

const worker = new Worker(
  'refund-analysis',
  async (job) => {
    const { ticketId, storeId, customerMessage, orderData, policyText } = job.data;
    logger.info('Processing refund job', { jobId: job.id, ticketId, storeId });
    await processTicketWithAI(ticketId, storeId, customerMessage, orderData, policyText);
  },
  {
    connection,
    concurrency: 5,
  }
);

worker.on('completed', (job) => {
  logger.info('Refund job completed', { jobId: job.id });
});

worker.on('failed', (job, err) => {
  logger.error('Refund job failed', { jobId: job?.id, error: err?.message });
});

logger.info('Refund worker started');
