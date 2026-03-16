/**
 * Store CRUD and lookup for Refusal Bot.
 */

import { prisma } from '../database/prisma.js';
import { logger } from '../utils/logger.js';

/**
 * Create a new store with generated API key.
 */
export async function createStore({ name, policy_text: policyText }) {
  const apiKey = `rb_${Date.now()}_${Math.random().toString(36).slice(2, 15)}`;
  const store = await prisma.store.create({
    data: { name, policyText, apiKey },
  });
  logger.info('Store created', { storeId: store.id, name: store.name });
  return store;
}

/**
 * List all stores (id, name, createdAt only; no apiKey in list).
 */
export async function listStores() {
  return prisma.store.findMany({
    select: { id: true, name: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  });
}

/**
 * Find store by ID.
 */
export async function getStoreById(id) {
  return prisma.store.findUnique({ where: { id } });
}

/**
 * Find store by API key (for auth).
 */
export async function getStoreByApiKey(apiKey) {
  return prisma.store.findUnique({ where: { apiKey } });
}
