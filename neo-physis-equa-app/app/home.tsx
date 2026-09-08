import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { clearSession, getSession, type Session } from '../src/services/session';

export default function HomeScreen() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((stored) => {
      setSession(stored);
      setLoading(false);
    });
  }, []);

  const handleLogout = useCallback(async () => {
    await clearSession();
    router.replace('/login');
  }, [router]);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-900">
        <ActivityIndicator color="#ffffff" size="large" />
      </View>
    );
  }

  if (!session || !session.token) {
    return <ActivityIndicator color="#ffffff" size="large" />;
  }

  return (
    <View className="flex-1 items-center justify-center bg-slate-900 px-6">
      <View className="mb-2 h-16 w-16 items-center justify-center rounded-2xl bg-blue-500">
        <Text className="text-2xl font-bold text-white">N</Text>
      </View>
      <Text className="mb-1 text-3xl font-bold text-white">Hola, {session.nombre}</Text>
      <Text className="mb-10 text-center text-sm text-slate-400">
        Has iniciado sesión correctamente
      </Text>

      <TouchableOpacity
        onPress={handleLogout}
        className="items-center rounded-xl border border-red-500 bg-red-500/10 px-6 py-3"
      >
        <Text className="text-base font-semibold text-red-400">Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}