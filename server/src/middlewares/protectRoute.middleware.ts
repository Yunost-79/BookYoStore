import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import User from '../models/user.model';
import { EStatusCodes } from '../types/Enums';

interface JwtPayloadWithUserId extends jwt.JwtPayload {
  userId?: string;
}

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;

export const protectRoute = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res
        .status(EStatusCodes.UNAUTHORIZED)
        .json({ error: 'Unauthorized - No token provided' });
    }

    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayloadWithUserId;

    if (decoded.userId) {
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return res.status(EStatusCodes.NOT_FOUND).json({ error: 'User not found' });
      }
      req.user = user;
    } else {
      return res.status(EStatusCodes.UNAUTHORIZED).json({ error: 'Unauthorized - Invalid token' });
    }

    next();
  } catch (e) {
    const err = e as Error;
    console.log('Error in protectRoute middleware', err.message);
    res.status(EStatusCodes.INTERNAL_SERVER_ERROR).json({ error: err.message });
  }
};
