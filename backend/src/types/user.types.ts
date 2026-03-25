import type { Request } from 'express';

export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  password_hash: string;
  role: string;
  activation_link: string | null;
  is_activated: boolean;
  created_at: Date;
}

export interface RegisterDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export type UserResponse = Omit<User, 'password_hash' | 'activation_link'>;

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    role: string;
  };
}
