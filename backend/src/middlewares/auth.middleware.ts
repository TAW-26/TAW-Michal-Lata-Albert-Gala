import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import type { AuthRequest } from '../types/user.types.js';

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token;

  if (!token) {
    return next(new ApiError(401, 'Brak autoryzacji. Zaloguj się.'));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as { userId: number; role: string };
    req.user = decoded;
    next();
  } catch (error) {
    return next(new ApiError(401, 'Nieprawidłowy lub wygasły token. Zaloguj się ponownie.'));
  }
}
