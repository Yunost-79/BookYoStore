import { Router } from 'express';

import {
  addToPurchaseList,
  getPurchaseHistory,
  deleteFromPurchaseHistory,
} from '../controllers/purchase.controller';

import { protectRoute } from '../middlewares/protectRoute.middleware';

const router = Router();

router.post('/add', protectRoute, addToPurchaseList);
router.get('/history', protectRoute, getPurchaseHistory);
router.delete('/delete/:itemId', protectRoute, deleteFromPurchaseHistory);

export default router;
