import bcrypt from 'bcrypt';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import * as userRepository from '../repositories/user.repository.js';
import * as emailService from './email.service.js';
import { ApiError } from '../utils/ApiError.js';
import type { RegisterDTO, UserResponse } from '../types/user.types.js';

const ROUNDS = 10;

export async function register(dto: RegisterDTO): Promise<UserResponse> {
  const { firstName, lastName, email, password } = dto;

  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    throw ApiError.conflict(
      'Użytkownik o podanym adresie email już istnieje',
    );
  }

  const activationLink = crypto.randomBytes(32).toString('hex');

  const passwordHash = await bcrypt.hash(password, ROUNDS);

  const user = await userRepository.create(
    firstName, 
    lastName, 
    email, 
    passwordHash, 
    activationLink
  );

  const verifyUrl = `http://localhost:3000/api/auth/verify/${activationLink}`;
  
  emailService.sendVerificationEmail({
    to: email,
    verificationLink: verifyUrl,
  });

  const { password_hash: _, activation_link: __, ...userResponse } = user;
  return userResponse;
}

export async function login(
  email: string,
  password: string,
): Promise<{ user: UserResponse; token: string }> {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Nieprawidłowy email lub hasło');
  }

  if (!user.is_activated) {
    throw new ApiError(403, 'Konto nie zostało aktywowane. Sprawdź swoją skrzynkę email.');
  }

  const isPasswordValid = await bcrypt.compare(password, user.password_hash);
  if (!isPasswordValid) {
    throw new ApiError(401, 'Nieprawidłowy email lub hasło');
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    env.JWT_SECRET,
    { expiresIn: '30d' }
  );

  const { password_hash: _, activation_link: __, ...userResponse } = user;
  return { user: userResponse, token };
}

export async function verifyEmail(token: string): Promise<void> {
  const user = await userRepository.findByActivationLink(token);
  if (!user) {
    throw new ApiError(400, 'Nieprawidłowy lub wygasły link aktywacyjny.');
  }

  if (user.is_activated) {
    throw new ApiError(400, 'Konto zostało już aktywowane.');
  }

  await userRepository.activateUser(user.id);
}
