/**
 * Prisma client singleton.
 * Use this instance across the app to avoid multiple connections.
 */

import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development'
    ? [{ emit: 'event', level: 'query' }]
    : [],
});

if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    logger.debug('Query', { query: e.query, duration: e.duration });
  });
}

export { prisma };
