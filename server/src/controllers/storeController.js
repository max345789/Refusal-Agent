/**
 * Store controller: create and list stores.
 */

import { z } from 'zod';
import * as storeService from '../services/storeService.js';

const createStoreSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  policy_text: z.string().min(1, 'Policy text is required'),
});

export async function createStore(req, res, next) {
  try {
    const parsed = createStoreSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: parsed.error.flatten().fieldErrors });
    }
    const store = await storeService.createStore(parsed.data);
    res.status(201).json(store);
  } catch (err) {
    next(err);
  }
}

/**
 * List stores: with auth returns single store (current); without auth could return empty or 401.
 * Spec says GET /api/stores - we require auth and return the authenticated store only.
 */
export async function getStores(req, res, next) {
  try {
    const store = req.store;
    res.json({ stores: [store] });
  } catch (err) {
    next(err);
  }
}
