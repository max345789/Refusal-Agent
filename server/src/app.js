/**
 * Express application setup for Refusal Bot API.
 * Configures middleware, routes, and error handling.
 */

import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { refundRoutes, storeRoutes, webhookRoutes } from './routes/index.js';
import { errorHandler } from './middleware/errorHandler.js';
import { logger } from './utils/logger.js';

const app = express();

// Trust proxy for rate limiting behind reverse proxies
app.set('trust proxy', 1);

// Global rate limit: 100 requests per 15 minutes per IP
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { error: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(globalLimiter);
app.use(cors());
app.use(express.json());

// Health check (no auth required)
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// API routes
app.use('/api', refundRoutes);
app.use('/api', storeRoutes);
app.use('/api/webhooks', webhookRoutes);

// 404 handler
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found', path: req.path });
});

// Central error handler
app.use(errorHandler);

export default app;
