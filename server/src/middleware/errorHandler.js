/**
 * Central error handler for Express.
 * Returns JSON and logs errors.
 */

import { logger } from '../utils/logger.js';

export function errorHandler(err, req, res, next) {
  logger.error('Request error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  const status = err.statusCode ?? err.status ?? 500;
  const message = err.message ?? 'Internal server error';
  res.status(status).json({ error: message });
}
