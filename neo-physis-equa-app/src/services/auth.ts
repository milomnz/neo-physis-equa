import { apiClient } from './api';

export interface AuthResponse {
  token: string | null;
  id: string;
  nombre: string;
  email: string;
  mensaje: string;
  role?: string;
  accessibilityProfile?: Record<string, unknown> | null;
  disabilityType?: string | null;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  disabilityType?: string | null;
  accessibilityProfile?: Record<string, unknown>;
}

export interface LoginData {
  email: string;
  password: string;
}

export async function register(data: RegisterData): Promise<AuthResponse> {
  return apiClient<AuthResponse>('/api/auth/registro', {
    method: 'POST',
    body: {
      name: data.name,
      email: data.email,
      password: data.password,
      ...(data.disabilityType !== undefined ? { disabilityType: data.disabilityType } : {}),
      ...(data.accessibilityProfile !== undefined
        ? { accessibilityProfile: data.accessibilityProfile }
        : {}),
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
