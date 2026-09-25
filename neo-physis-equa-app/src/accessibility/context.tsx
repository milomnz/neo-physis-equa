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
        bg: 'bg-noche',
        card: 'bg-turquesa border-2 border-crema',
        title: 'text-crema',
        body: 'text-crema',
        sub: 'text-crema/80',
        faint: 'text-crema/60',
        chipBg: 'bg-crema text-noche',
        errorBanner: 'bg-red-950 text-red-300',
        successBanner: 'bg-green-950 text-green-300',
        spinner: '#F3F4F4',
      }
    : {
        bg: 'bg-crema',
        card: 'bg-white border border-turquesa',
        title: 'text-noche',
        body: 'text-noche',
        sub: 'text-turquesa',
        faint: 'text-turquesa/70',
        chipBg: 'bg-white text-noche',
        errorBanner: 'bg-red-50 text-red-700',
        successBanner: 'bg-green-50 text-green-700',
        spinner: '#17536D',
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