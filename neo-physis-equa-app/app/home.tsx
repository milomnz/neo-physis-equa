import { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Button from '../src/components/Button';
import { useAccessibility } from '../src/accessibility/context';
import { getSession, type Session } from '../src/services/session';

export default function HomeScreen() {
  const router = useRouter();
  const { palette } = useAccessibility();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSession().then((stored) => {
      setSession(stored);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${palette.bg}`}>
        <ActivityIndicator color={palette.spinner} />
      </View>
    );
  }

  if (!session || !session.token) {
    return <ActivityIndicator />;
  }

  return (
    <View className={`flex-1 items-center justify-center gap-6 p-6 ${palette.bg}`}>
      <Text className={`text-2xl font-bricolage ${palette.title}`}>Hola, {session.nombre}</Text>
      <Text className={`text-center ${palette.sub}`}>
        Gestiona tus fincas, cultivos y plagas desde el menú lateral
      </Text>
      <Button text="Ir a mi perfil →" onPress={() => router.push('/profile')} />
      <Button text="Mis Fincas →" onPress={() => router.push('/farms')} />
    </View>
  );
}