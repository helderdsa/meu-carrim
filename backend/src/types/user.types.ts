import { Request } from 'express';
import { User } from '@prisma/client';

export interface CreateUserRequest {
  name: string;
  email: string;
  password: string;
  avatar?: string;
}

export interface UpdateUserRequest {
  name?: string;
  email?: string;
  avatar?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthRequest extends Request {
  user?: User;
}

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LoginResponse {
  user: UserResponse;
  token: string;
}
