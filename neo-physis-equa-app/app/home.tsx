import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../src/components/Button';
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
      <View className="flex-1 items-center justify-center bg-neutral-50">
        <ActivityIndicator />
      </View>
    );
  }

  if (!session || !session.token) {
    return <ActivityIndicator />;
  }

  return (
    <View className="flex-1 items-center justify-center gap-5 bg-neutral-50 p-6">
      <View className="mb-2 h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
        <Text className="text-2xl font-bold text-white">N</Text>
      </View>
      <Text className="text-2xl font-bold text-neutral-900">Hola, {session.nombre}</Text>
      <Text className="text-center text-neutral-500">
        Has iniciado sesión correctamente
      </Text>

      <Button text="Cerrar sesión" onPress={handleLogout} secondary className="border-red-500" />
    </View>
  );
}