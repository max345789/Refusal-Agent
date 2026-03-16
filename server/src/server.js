/**
 * Refusal Bot - Entry point.
 * Starts Express server and connects to database.
 */

import 'dotenv/config';
import app from './app.js';
import { prisma } from './database/prisma.js';
import { logger } from './utils/logger.js';

const PORT = process.env.PORT ?? 3000;

async function start() {
  try {
    await prisma.$connect();
    logger.info('Database connected');

    app.listen(PORT, () => {
      logger.info(`Server running at http://localhost:${PORT}`);
    });
  } catch (err) {
    logger.error('Failed to start server', { error: err.message });
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down');
  await prisma.$disconnect();
  process.exit(0);
});

start();
