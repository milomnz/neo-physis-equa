import { apiClient } from './api';

export interface AuthResponse {
  token: string | null;
  id: number;
  nombre: string;
  email: string;
  mensaje: string;
}

export interface RegisterData {
  nombre: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/api/auth/registro', {
    method: 'POST',
    body: {
      nombre: data.nombre,
      email: data.email,
      password: data.password,
    },
  });
}

export async function login(data: LoginData): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: {
      email: data.email,
      password: data.password,
    },
  });
}
