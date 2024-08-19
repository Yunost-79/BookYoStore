import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

import { EStatusCodes } from '../types/Enums';

const validateUserId = (req: Request, res: Response, next: NextFunction) => {
  const { id: userId } = req.params;

  if (userId && !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(EStatusCodes.BAD_REQUEST).json({ message: `Invalid user ID: ${userId}` });
  }

  next();
};

export default validateUserId;
