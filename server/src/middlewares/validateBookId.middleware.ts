import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import { EStatusCodes } from '../types/Enums';

const validateBookId = (req: Request, res: Response, next: NextFunction) => {
  const { id: bookId } = req.params;

  if (bookId && !mongoose.Types.ObjectId.isValid(bookId)) {
    return res.status(EStatusCodes.BAD_REQUEST).json({ message: `Invalid book ID: ${bookId}` });
  }

  next();
};

export default validateBookId;
