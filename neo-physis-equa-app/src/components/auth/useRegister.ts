import { useState } from 'react';
import { register as registerRequest, type RegisterData } from '../../services/auth';

interface UseRegisterResult {
  loading: boolean;
  error: string | null;
  register: (data: RegisterData) => Promise<boolean>;
}

export function useRegister(): UseRegisterResult {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const register = async (data: RegisterData): Promise<boolean> => {
    setLoading(true);
    setError(null);
    try {
      await registerRequest(data);
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado del servidor');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return { loading, error, register };
}