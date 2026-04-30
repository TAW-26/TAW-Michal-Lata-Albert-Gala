import * as userRepository from '../repositories/user.repository.js';
import { ApiError } from '../utils/ApiError.js';
import type { UserResponse, UpdateProfileDTO } from '../types/user.types.js';
import bcrypt from 'bcrypt';

const ROUNDS = 10;

export async function getProfile(userId: number): Promise<UserResponse> {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw ApiError.notFound('Nie znaleziono użytkownika.');
  }

  const { password_hash: _, activation_link: __, ...userResponse } = user;
  return userResponse;
}

export async function updateProfile(
  userId: number,
  data: UpdateProfileDTO
): Promise<UserResponse> {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw ApiError.notFound('Nie znaleziono użytkownika.');
  }

  const updated = await userRepository.updateProfile(userId, data);
  const { password_hash: _, activation_link: __, ...userResponse } = updated;
  return userResponse;
}

export async function changePassword(
  userId: number,
  currentPassword: string,
  newPassword: string
): Promise<void> {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw ApiError.notFound('Nie znaleziono użytkownika.');
  }

  const isValid = await bcrypt.compare(currentPassword, user.password_hash);
  if (!isValid) {
    throw ApiError.badRequest('Obecne hasło jest nieprawidłowe.');
  }

  const passwordHash = await bcrypt.hash(newPassword, ROUNDS);
  await userRepository.changePassword(userId, passwordHash);
}

export async function deleteAccount(userId: number): Promise<void> {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw ApiError.notFound('Nie znaleziono użytkownika.');
  }

  await userRepository.deleteById(userId);
}

export async function getAllUsers(): Promise<UserResponse[]> {
  const users = await userRepository.findAll();
  return users.map((user) => {
    const { password_hash: _, activation_link: __, ...userResponse } = user;
    return userResponse;
  });
}

export async function getUserWithReservations(
  userId: number
): Promise<{ user: UserResponse; reservations: import('../types/reservation.types.js').ReservationWithDetails[] }> {
  const user = await userRepository.findById(userId);
  if (!user) {
    throw ApiError.notFound('Nie znaleziono użytkownika.');
  }

  const { password_hash: _, activation_link: __, ...userResponse } = user;

  const reservationRepository = await import('../repositories/reservation.repository.js');
  const reservations = await reservationRepository.findByUserId(userId);

  return { user: userResponse, reservations };
}

