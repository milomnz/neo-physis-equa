import { Platform } from 'react-native';
import Constants from 'expo-constants';

function resolveBaseUrl(): string {
  if (process.env.EXPO_PUBLIC_API_URL) {
    return process.env.EXPO_PUBLIC_API_URL;
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(':')[0];
    if (host) {
      return `http://${host}:8080`;
    }
  }

  return Platform.select({
    android: 'http://10.0.2.2:8080',
    default: 'http://localhost:8080',
  }) as string;
}

export const BASE_URL = resolveBaseUrl();

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, mensaje: string) {
    super(mensaje);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface ApiClientOptions extends Omit<RequestInit, 'body'> {
  body?: unknown;
}

export async function apiClient<T>(endpoint: string, options: ApiClientOptions = {}): Promise<T> {
  const { body, headers, ...rest } = options;

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...rest,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const mensaje = data?.mensaje ?? 'Error inesperado del servidor';
    throw new ApiError(response.status, mensaje);
  }

  return data as T;
}
