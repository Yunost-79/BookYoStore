import { Router } from 'express';

import { getAllBooks, getBooksById } from '../controllers/book.controller';

import { protectRoute } from '../middlewares/protectRoute.middleware';
import validateBookId from '../middlewares/validateBookId.middleware';

const router = Router();

router.use(protectRoute);

router.get('/', getAllBooks);
router.get('/:id', validateBookId, getBooksById);

export default router;
