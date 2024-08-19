import { Router } from 'express';

import { getAllBooks, getBooksById } from '../controllers/book.controller';

import { protectRoute } from '../middlewares/protectRoute.middleware';

const router = Router();

router.get('/', protectRoute, getAllBooks);
router.get('/:id', protectRoute, getBooksById);

export default router;
