import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import Badge from '../src/components/Badge';
import Button from '../src/components/Button';
import { useAccessibility } from '../src/accessibility/context';
import { clearSession, getSession, type Session } from '../src/services/session';

const DISABILITY_LABELS: Record<string, string> = {
  motora: 'Motora',
  visual: 'Visual',
  auditiva: 'Auditiva',
  intelectual: 'Intelectual',
};

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

  const handleLogout = useCallback(async () => {
    await clearSession();
    router.replace('/login');
  }, [router]);

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

  const profile = session.accessibilityProfile ?? {};
  const ttsEnabled = profile.ttsEnabled === true;
  const highContrast = profile.highContrast === true;
  const disability =
    session.disabilityType && session.disabilityType !== 'ninguna'
      ? session.disabilityType
      : null;

  return (
    <View className={`flex-1 p-6 ${palette.bg}`}>
      <View className="items-center gap-2 pt-8">
        <View className="mb-2 h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
          <Text className="text-2xl font-bold text-white">N</Text>
        </View>
        <Text className={`text-2xl font-bold ${palette.title}`}>Hola, {session.nombre}</Text>
        <Text className={`text-center ${palette.sub}`}>Has iniciado sesión correctamente</Text>
      </View>

      <View className={`mt-8 rounded-2xl p-5 ${palette.card}`}>
        <Text className={`mb-3 text-lg font-bold ${palette.title}`}>Mi perfil de accesibilidad</Text>
        <Text className={`mb-2 text-sm ${palette.sub}`}>
          Adaptaciones activas para tu experiencia
        </Text>
        <View className="flex-row flex-wrap gap-2">
          {disability ? (
            <Badge value={disability} />
          ) : (
            <Text className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${palette.chipBg}`}>
              Discapacidad: ninguna
            </Text>
          )}
          <Badge value={ttsEnabled ? 'resuelto' : 'inactivo'} />
          <Badge value={highContrast ? 'activo' : 'inactivo'} />
        </View>
        <View className="mt-3 gap-1">
          <Text className={`text-xs ${palette.sub}`}>
            Lectura por voz (TTS): {ttsEnabled ? 'Activada' : 'Desactivada'}
          </Text>
          <Text className={`text-xs ${palette.sub}`}>
            Alto contraste: {highContrast ? 'Activado' : 'Desactivado'}
          </Text>
        </View>
      </View>

      <View className="mt-6 gap-3">
        <Button
          text="Mis Fincas →"
          onPress={() => router.push('/farms')}
        />
        <Button text="Cerrar sesión" onPress={handleLogout} secondary className="border-red-500" />
      </View>
    </View>
  );
}