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
      <View className="flex-1 items-center justify-center bg-slate-50">
        <ActivityIndicator color="#10b981" size="large" />
      </View>
    );
  }

  if (!session || !session.token) {
    return <ActivityIndicator color="#10b981" size="large" />;
  }

  return (
    <View className="flex-1 justify-center bg-slate-50 px-6">
      <View className="items-center rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <View className="mb-4 h-20 w-20 items-center justify-center rounded-3xl bg-emerald-500">
          <Text className="text-4xl font-bold text-white">N</Text>
        </View>

        <Text className="text-center text-2xl font-bold text-slate-900">
          ¡Hola, {session.nombre}!
        </Text>
        <Text className="mt-2 text-center text-sm text-slate-500">
          {session.email}
        </Text>
        <Text className="mt-6 text-center text-sm text-slate-500">
          Has iniciado sesión correctamente
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleLogout}
        className="mt-6 items-center rounded-xl border border-rose-200 bg-rose-50 px-6 py-3.5"
      >
        <Text className="text-base font-semibold text-rose-600">Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}