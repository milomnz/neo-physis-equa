import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { useRouter } from 'expo-router';
import { clearSession, getSession, type Session } from '../src/services/session';

const DISABILITY_LABELS: Record<string, string> = {
  motora: 'Motora',
  visual: 'Visual',
  auditiva: 'Auditiva',
  intelectual: 'Intelectual',
};

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

  const profile = session.accessibilityProfile ?? {};
  const ttsEnabled = profile.ttsEnabled === true;
  const highContrast = profile.highContrast === true;
  const disability =
    session.disabilityType && session.disabilityType !== 'ninguna'
      ? session.disabilityType
      : null;

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

        <View className="mt-6 w-full rounded-2xl border border-slate-100 bg-slate-50 p-4">
          <Text className="mb-3 text-center text-sm font-semibold text-slate-700">
            Mi perfil de accesibilidad
          </Text>
          {disability && (
            <View className="mb-3 self-center rounded-full bg-violet-100 px-4 py-1.5">
              <Text className="text-xs font-semibold text-violet-700">
                Discapacidad: {DISABILITY_LABELS[disability] ?? disability}
              </Text>
            </View>
          )}

          <View className="flex-row items-center justify-between border-b border-slate-200 py-2">
            <Text className="text-sm text-slate-600">Lectura en voz alta</Text>
            <Text className={`text-sm font-semibold ${ttsEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
              {ttsEnabled ? 'Activada' : 'Desactivada'}
            </Text>
          </View>
          <View className="flex-row items-center justify-between py-2">
            <Text className="text-sm text-slate-600">Alto contraste</Text>
            <Text className={`text-sm font-semibold ${highContrast ? 'text-emerald-600' : 'text-slate-400'}`}>
              {highContrast ? 'Activada' : 'Desactivada'}
            </Text>
          </View>
        </View>
      </View>

      <TouchableOpacity
        accessibilityLabel="Gestionar mis fincas"
        accessibilityHint="Abre la pantalla de gestión de fincas para inscribir predios y diagnosticar plagas"
        accessibilityRole="button"
        onPress={() => router.push('/farms')}
        className="mt-6 items-center rounded-2xl bg-emerald-600 px-6 py-4 shadow-sm"
      >
        <Text className="text-base font-bold text-white">🌾 Gestionar mis Fincas</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleLogout}
        className="mt-6 items-center rounded-xl border border-rose-200 bg-rose-50 px-6 py-3.5"
      >
        <Text className="text-base font-semibold text-rose-600">Cerrar sesión</Text>
      </TouchableOpacity>
    </View>
  );
}