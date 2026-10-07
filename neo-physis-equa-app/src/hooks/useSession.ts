import { useCallback, useEffect, useState } from 'react';
import { clearSession, getSession, type Session } from '../services/session';

interface UseSessionResult {
  session: Session | null;
  loading: boolean;
  logout: () => Promise<void>;
}

export function useSession(): UseSessionResult {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((stored) => {
      setSession(stored);
      setLoading(false);
    });
  }, []);

  const logout = useCallback(async () => {
    await clearSession();
    setSession(null);
  }, []);

  return { session, loading, logout };
}