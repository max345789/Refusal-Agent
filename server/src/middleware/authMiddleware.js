/**
 * API key authentication for store-scoped requests.
 * Expects X-API-Key header or Authorization: Bearer <key>.
 */

import { getStoreByApiKey } from '../services/storeService.js';
import { logger } from '../utils/logger.js';

/**
 * Resolves store from API key and attaches to req.store.
 * Responds 401 if missing or invalid.
 */
export async function requireStoreAuth(req, res, next) {
  const raw =
    req.headers['x-api-key'] ||
    (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')
      ? req.headers.authorization.slice(7)
      : null);

  if (!raw) {
    return res.status(401).json({ error: 'Missing API key. Provide X-API-Key or Authorization: Bearer <key>.' });
  }

  const store = await getStoreByApiKey(raw.trim());
  if (!store) {
    logger.warn('Invalid API key attempt');
    return res.status(401).json({ error: 'Invalid API key.' });
  }

  req.store = store;
  next();
}
