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

export async function changePassword(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, 'Nieautoryzowany');
    }

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new ApiError(400, 'Obecne hasło i nowe hasło są wymagane.');
    }

    await userService.changePassword(userId, currentPassword, newPassword);

    res.status(200).json({
      message: 'Hasło zostało zmienione pomyślnie.',
    });
  } catch (error) {
    next(error);
  }
}

export async function deleteMe(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      throw new ApiError(401, 'Nieautoryzowany');
    }

    await userService.deleteAccount(userId);

    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    res.status(200).json({
      message: 'Konto zostało usunięte.',
    });
  } catch (error) {
    next(error);
  }
}

