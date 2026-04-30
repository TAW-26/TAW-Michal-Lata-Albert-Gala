import type { Request, Response, NextFunction } from 'express';
import * as authService from '../services/auth.service.js';
import { ApiError } from '../utils/ApiError.js';
import type { RegisterDTO, LoginDTO } from '../types/user.types.js';

export async function register(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { firstName, lastName, email, password } = req.body as RegisterDTO;

    if (!firstName || !lastName || !email || !password) {
      throw ApiError.badRequest(
        'Wszystkie pola są wymagane: firstName, lastName, email, password'
      );
    }

    const user = await authService.register({
      firstName,
      lastName,
      email,
      password,
    });

    res.status(201).json({
      message: 'Użytkownik zarejestrowany. Sprawdź email, aby aktywować konto.',
      user,
    });
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email, password, rememberMe } = req.body as LoginDTO;

    if (!email || !password) {
      throw ApiError.badRequest('Wszystkie pola są wymagane: email, password');
    }

    const { user, token } = await authService.login(email, password);

    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax' as const,
      ...(rememberMe ? { maxAge: 30 * 24 * 60 * 60 * 1000 } : {}),
    };

    res.cookie('token', token, cookieOptions);

    res.status(200).json({
      message: 'Użytkownik zalogowany pomyślnie',
      user: user,
    });
  } catch (error) {
    next(error);
  }
}

export async function verify(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { token } = req.params;

    if (!token || typeof token !== 'string') {
      throw ApiError.badRequest('Brak tokenu aktywacyjnego.');
    }

    await authService.verifyEmail(token);

    res.status(200).json({
      message:
        'Konto zostało pomyślnie aktywowane. Możesz się teraz zalogować.',
    });
  } catch (error) {
    next(error);
  }
}

export async function logout(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    res.status(200).json({ message: 'Wylogowano pomyślnie' });
  } catch (error) {
    next(error);
  }
}

export async function forgotPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { email } = req.body;
    if (!email) {
      throw ApiError.badRequest('Adres email jest wymagany');
    }
    await authService.forgotPassword(email);
    res
      .status(200)
      .json({
        message:
          'Jeśli adres istnieje w bazie, wysłano email z linkiem resetującym',
      });
  } catch (error) {
    next(error);
  }
}

export async function resetPassword(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = req.params.token as string;
    const { password } = req.body;

    if (!token || !password) {
      throw ApiError.badRequest('Brak tokenu lub nowego hasła');
    }

    await authService.resetPassword(token, password);
    res.status(200).json({ message: 'Hasło zostało pomyślnie zresetowane' });
  } catch (error) {
    next(error);
  }
}
