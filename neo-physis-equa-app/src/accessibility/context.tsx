import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { usePathname } from 'expo-router';
import { getSession, type Session } from '../services/session';

export interface AppPalette {
  bg: string;
  card: string;
  title: string;
  body: string;
  sub: string;
  faint: string;
  chipBg: string;
  errorBanner: string;
  successBanner: string;
  spinner: string;
}

export const buildPalette = (highContrast: boolean): AppPalette =>
  highContrast
    ? {
        bg: 'bg-black',
        card: 'bg-zinc-900 border-2 border-amber-400',
        title: 'text-amber-400',
        body: 'text-zinc-200',
        sub: 'text-zinc-300',
        faint: 'text-zinc-400',
        chipBg: 'bg-zinc-800 text-amber-400',
        errorBanner: 'bg-red-950 text-red-400',
        successBanner: 'bg-green-950 text-green-400',
        spinner: '#fbbf24',
      }
    : {
        bg: 'bg-neutral-50',
        card: 'bg-white border border-neutral-200',
        title: 'text-neutral-900',
        body: 'text-neutral-700',
        sub: 'text-neutral-500',
        faint: 'text-neutral-400',
        chipBg: 'bg-neutral-100 text-neutral-600',
        errorBanner: 'bg-red-50 text-red-700',
        successBanner: 'bg-green-50 text-green-700',
        spinner: '#2563eb',
      };

interface AccessibilityContextValue {
  highContrast: boolean;
  session: Session | null;
  palette: AppPalette;
}

const AccessibilityContext = createContext<AccessibilityContextValue>({
  highContrast: false,
  session: null,
  palette: buildPalette(false),
});

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    let active = true;
    getSession().then((stored) => {
      if (active) {
        setSession(stored);
      }
    });
    return () => {
      active = false;
    };
  }, [pathname]);

  const highContrast = session?.accessibilityProfile?.highContrast === true;

  return (
    <AccessibilityContext.Provider
      value={{ highContrast, session, palette: buildPalette(highContrast) }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility(): AccessibilityContextValue {
  return useContext(AccessibilityContext);
}