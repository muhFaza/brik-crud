import { Request } from 'express';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    name: string;
  };
}

export interface LoginData {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface CreateProductData {
  name: string;
  description?: string;
  price: number;
  stock: number;
  imageUrl?: string;
  isActive?: boolean;
}

export interface UpdateProductData extends Partial<CreateProductData> {}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface JwtPayload {
  id: number;
  email: string;
  name: string;
}