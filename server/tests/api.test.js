/**
 * API tests - Refusal Bot
 * Run: npm test
 */

import request from 'supertest';
import app from '../src/app.js';

describe('Refusal Bot API', () => {
  describe('GET /health', () => {
    it('returns status ok', async () => {
      const res = await request(app).get('/health');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ status: 'ok' });
    });
  });
});
