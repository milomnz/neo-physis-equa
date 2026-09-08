import { Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';

export interface Session {
  token: string;
  id: number;
  nombre: string;
  email: string;
}

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';

async function readKey(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
  }
  return SecureStore.getItemAsync(key);
}

async function writeKey(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(key, value);
    }
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

async function deleteKey(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    if (typeof window !== 'undefined') {
      window.localStorage.removeItem(key);
    }
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export async function saveSession(session: Session): Promise<void> {
  await writeKey(TOKEN_KEY, session.token);
  await writeKey(
    USER_KEY,
    JSON.stringify({ id: session.id, nombre: session.nombre, email: session.email }),
  );
}

export async function getSession(): Promise<Session | null> {
  const token = await readKey(TOKEN_KEY);
  if (!token) {
    return null;
  }

  const userRaw = await readKey(USER_KEY);
  try {
    const user = userRaw ? JSON.parse(userRaw) : {};
    return {
      token,
      id: user.id ?? 0,
      nombre: user.nombre ?? '',
      email: user.email ?? '',
    };
  } catch {
    return { token, id: 0, nombre: '', email: '' };
  }
}

export async function clearSession(): Promise<void> {
  await deleteKey(TOKEN_KEY);
  await deleteKey(USER_KEY);
}