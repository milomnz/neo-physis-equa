import { useState } from 'react';
import { login as loginRequest, type LoginData } from '../services/auth';
import { saveSession } from '../services/session';

interface UseLoginResult {
  loading: boolean;
  error: string | null;
  login: (data: LoginData) => Promise<boolean>;
}

export function useLogin(): UseLoginResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const login = async (data: LoginData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      const response = await loginRequest({ email: data.email.trim(), password: data.password });
      if (!response.token) {
        throw new Error('No se recibió un token de sesión');
      }
      await saveSession({
        token: response.token,
        id: response.id,
        nombre: response.nombre,
        email: response.email,
        role: response.role,
        accessibilityProfile: response.accessibilityProfile,
        disabilityType: response.disabilityType,
      });
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado del servidor');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, login };
}