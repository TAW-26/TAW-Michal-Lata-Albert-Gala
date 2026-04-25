import type { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { ApiError } from '../utils/ApiError.js';
import { pool } from '../config/db.js';
import type { AuthRequest } from '../types/user.types.js';

export function requireAuth(
  req: AuthRequest,
  res: Response,
  next: NextFunction
) {
  const token = req.cookies?.token;

  if (!token) {
    return next(new ApiError(401, 'Brak autoryzacji. Zaloguj się.'));
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET) as {
      userId: number;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (error) {
    return next(
      new ApiError(
        401,
        'Nieprawidłowy lub wygasły token. Zaloguj się ponownie.'
      )
    );
  }
}

export function requireOwner(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  if (!req.user || req.user.role !== 'owner') {
    return next(ApiError.forbidden('Dostęp tylko dla właścicieli obiektów.'));
  }
  next();
}

export async function requireOwnerOfFacility(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  try {
    const facilityId = parseInt(String(req.params.id), 10);
    if (isNaN(facilityId)) {
      return next(ApiError.badRequest('Nieprawidłowe ID obiektu.'));
    }

    const result = await pool.query(
      'SELECT owner_id FROM facilities WHERE id = $1',
      [facilityId]
    );

    if (result.rows.length === 0) {
      return next(ApiError.notFound('Obiekt nie został znaleziony.'));
    }

    if (result.rows[0].owner_id !== req.user?.userId) {
      return next(ApiError.forbidden('Nie masz uprawnień do tego obiektu.'));
    }

    next();
  } catch (error) {
    next(error);
  }
}
