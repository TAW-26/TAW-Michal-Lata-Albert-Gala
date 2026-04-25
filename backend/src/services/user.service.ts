import * as userRepository from '../repositories/user.repository.js';
import { ApiError } from '../utils/ApiError.js';
import type { UserResponse, UpdateProfileDTO } from '../types/user.types.js';

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
