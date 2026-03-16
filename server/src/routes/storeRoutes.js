/**
 * Store API routes: create store, list (current) store.
 */

import { Router } from 'express';
import { requireStoreAuth } from '../middleware/authMiddleware.js';
import * as storeController from '../controllers/storeController.js';

const router = Router();

router.post('/stores', storeController.createStore);
router.get('/stores', requireStoreAuth, storeController.getStores);

export const storeRoutes = router;
