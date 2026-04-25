import type { Response, NextFunction } from 'express';
import * as userService from '../services/user.service.js';
import type { AuthRequest, UpdateProfileDTO } from '../types/user.types.js';
import { ApiError } from '../utils/ApiError.js';

export async function getMe(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, 'Nieautoryzowany');
    }

    const user = await userService.getProfile(userId);

    res.status(200).json({ user });
  } catch (error) {
    next(error);
  }
}

export async function updateMe(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, 'Nieautoryzowany');
    }

    const data = req.body as UpdateProfileDTO;
    const user = await userService.updateProfile(userId, data);

    res.status(200).json({
      message: 'Profil zaktualizowany pomyślnie.',
      user,
    });
  } catch (error) {
    next(error);
  }
}
