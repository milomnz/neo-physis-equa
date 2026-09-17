import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { createFarm, getFarms, type Farm } from '../../src/services/farms';
import { getSession, type Session } from '../../src/services/session';
import SearchBar from '../../src/components/SearchBar';

export default function FarmsScreen() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [vereda, setVereda] = useState('');
  const [municipio, setMunicipio] = useState('');
  const [altitude, setAltitude] = useState('');

  const loadFarms = useCallback(async () => {
    try {
      setLoading(true);
      const userSession = await getSession();
      setSession(userSession);

      if (!userSession?.token) {
        router.replace('/login');
        return;
      }

      const data = await getFarms();
      setFarms(data);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error al cargar las fincas';
      Alert.alert('Error', errorMsg);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadFarms();
  }, [loadFarms]);

  const handleCreateFarm = async () => {
    if (!name.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa el nombre de la finca.');
      return;
    }
    const parsedAltitude = parseFloat(altitude);
    if (isNaN(parsedAltitude) || parsedAltitude < 0) {
      Alert.alert('Altitud inválida', 'Por favor ingresa una altitud válida en metros sobre el nivel del mar.');
      return;
    }

    try {
      setSubmitting(true);
      await createFarm({
        name: name.trim(),
        location: {
          vereda: vereda.trim() || undefined,
          municipio: municipio.trim() || undefined,
        },
        altitude: parsedAltitude,
      });

      Alert.alert('¡Éxito!', 'Finca registrada correctamente.');
      setName('');
      setVereda('');
      setMunicipio('');
      setAltitude('');
      setShowForm(false);
      loadFarms();
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Error al registrar la finca';
      Alert.alert('Error', errorMsg);
    } finally {
      setSubmitting(false);
    }
  };

  const isHighContrast = session?.accessibilityProfile?.highContrast === true;

  const filteredFarms = search.trim()
    ? farms.filter((farm) => {
        const location = [farm.location?.vereda, farm.location?.municipio, farm.location?.departamento]
          .filter(Boolean)
          .join(' ')
          .toLowerCase();
        return (
          farm.name.toLowerCase().includes(search.toLowerCase()) ||
          location.includes(search.toLowerCase())
        );
      })
    : farms;

  const containerBg = isHighContrast ? 'bg-black' : 'bg-slate-50';
  const cardBg = isHighContrast ? 'bg-zinc-900 border-2 border-amber-400' : 'bg-white border border-slate-200';
  const textColor = isHighContrast ? 'text-amber-400' : 'text-slate-900';
  const subTextColor = isHighContrast ? 'text-zinc-300' : 'text-slate-600';
  const primaryButtonBg = isHighContrast ? 'bg-amber-400' : 'bg-emerald-600';
  const primaryButtonText = isHighContrast ? 'text-black font-bold' : 'text-white font-semibold';

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${containerBg}`}>
        <ActivityIndicator color={isHighContrast ? '#fbbf24' : '#059669'} size="large" />
      </View>
    );
  }

  return (
    <View className={`flex-1 ${containerBg} px-4 py-6`}>
      {/* Dynamic Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className={`text-2xl font-bold ${textColor}`}>Mis Fincas 🌾</Text>
          <Text className={`text-sm ${subTextColor}`}>
            Entidad agronómica para predicción de plagas
          </Text>
        </View>

        <TouchableOpacity
          accessibilityLabel={showForm ? 'Cerrar formulario de registro' : 'Registrar nueva finca'}
          accessibilityHint="Muestra u oculta el formulario para inscribir un nuevo terreno agrícola"
          accessibilityRole="button"
          onPress={() => setShowForm(!showForm)}
          className={`rounded-2xl px-4 py-3 ${primaryButtonBg}`}
        >
          <Text className={`text-base ${primaryButtonText}`}>
            {showForm ? '✕ Cancelar' : '+ Nueva Finca'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Accessible Registration Form */}
      {showForm && (
        <ScrollView className={`mb-6 rounded-3xl p-5 ${cardBg}`}>
          <Text className={`mb-4 text-xl font-bold ${textColor}`}>
            Inscribir Terreno Agrícola
          </Text>

          <Text className={`mb-1 text-sm font-semibold ${subTextColor}`}>
            Nombre de la Finca *
          </Text>
          <TextInput
            accessibilityLabel="Nombre de la finca"
            accessibilityHint="Ingresa el nombre descriptivo de tu finca o predio"
            value={name}
            onChangeText={setName}
            placeholder="ej. Finca El Paraíso"
            placeholderTextColor={isHighContrast ? '#a1a1aa' : '#94a3b8'}
            className={`mb-4 rounded-xl border p-3.5 text-base ${
              isHighContrast
                ? 'border-amber-400 bg-black text-amber-400'
                : 'border-slate-300 bg-white text-slate-900'
            }`}
          />

          <View className="flex-row space-x-3">
            <View className="flex-1">
              <Text className={`mb-1 text-sm font-semibold ${subTextColor}`}>
                Vereda
              </Text>
              <TextInput
                accessibilityLabel="Vereda"
                accessibilityHint="Ingresa la vereda donde está ubicada la finca"
                value={vereda}
                onChangeText={setVereda}
                placeholder="ej. La Esmeralda"
                placeholderTextColor={isHighContrast ? '#a1a1aa' : '#94a3b8'}
                className={`mb-4 rounded-xl border p-3.5 text-base ${
                  isHighContrast
                    ? 'border-amber-400 bg-black text-amber-400'
                    : 'border-slate-300 bg-white text-slate-900'
                }`}
              />
            </View>

            <View className="flex-1">
              <Text className={`mb-1 text-sm font-semibold ${subTextColor}`}>
                Municipio
              </Text>
              <TextInput
                accessibilityLabel="Municipio"
                accessibilityHint="Ingresa el municipio de ubicación"
                value={municipio}
                onChangeText={setMunicipio}
                placeholder="ej. Armero"
                placeholderTextColor={isHighContrast ? '#a1a1aa' : '#94a3b8'}
                className={`mb-4 rounded-xl border p-3.5 text-base ${
                  isHighContrast
                    ? 'border-amber-400 bg-black text-amber-400'
                    : 'border-slate-300 bg-white text-slate-900'
                }`}
              />
            </View>
          </View>

          <Text className={`mb-1 text-sm font-semibold ${subTextColor}`}>
            Altitud (m.s.n.m.) *
          </Text>
          <TextInput
            accessibilityLabel="Altitud en metros sobre el nivel del mar"
            accessibilityHint="Ingresa la altitud numérica de la finca"
            value={altitude}
            onChangeText={setAltitude}
            keyboardType="numeric"
            placeholder="ej. 1650"
            placeholderTextColor={isHighContrast ? '#a1a1aa' : '#94a3b8'}
            className={`mb-6 rounded-xl border p-3.5 text-base ${
              isHighContrast
                ? 'border-amber-400 bg-black text-amber-400'
                : 'border-slate-300 bg-white text-slate-900'
            }`}
          />

          <TouchableOpacity
            accessibilityLabel="Guardar finca"
            accessibilityHint="Envía los datos de la finca al servidor"
            accessibilityRole="button"
            disabled={submitting}
            onPress={handleCreateFarm}
            className={`items-center rounded-xl p-4 ${primaryButtonBg}`}
          >
            {submitting ? (
              <ActivityIndicator color={isHighContrast ? '#000000' : '#ffffff'} />
            ) : (
              <Text className={`text-lg font-bold ${primaryButtonText}`}>
                ✓ Registrar Finca
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Farms List */}
      {farms.length === 0 ? (
        <View className={`items-center justify-center rounded-3xl p-8 ${cardBg}`}>
          <Text className={`text-center text-lg font-semibold ${textColor}`}>
            No tienes fincas registradas
          </Text>
          <Text className={`mt-2 text-center text-sm ${subTextColor}`}>
            Inscribe tu primera finca para vincularla a la cámara de detección de plagas.
          </Text>
        </View>
      ) : (
        <FlatList
          data={filteredFarms}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            farms.length > 1 || filteredFarms.length === 0 ? (
              <SearchBar
                value={search}
                onChangeText={setSearch}
                placeholder="Buscar finca por nombre o ubicación"
              />
            ) : null
          }
          ListEmptyComponent={
            <Text className={`py-6 text-center text-sm ${subTextColor}`}>
              No se encontraron fincas con el criterio de búsqueda.
            </Text>
          }
          renderItem={({ item }) => (
            <View
              accessibilityLabel={`Finca ${item.name}, altitud ${item.altitude} metros sobre el nivel del mar.`}
              className={`mb-4 rounded-3xl p-5 shadow-sm ${cardBg}`}
            >
              <View className="flex-row items-center justify-between">
                <Text className={`text-xl font-bold ${textColor}`}>{item.name}</Text>
                <View className="rounded-full bg-emerald-100 px-3 py-1">
                  <Text className="text-xs font-bold text-emerald-800">
                    {item.altitude} m.s.n.m.
                  </Text>
                </View>
              </View>

              <Text className={`mt-2 text-sm ${subTextColor}`}>
                📍 Ubicación:{' '}
                {[item.location?.vereda, item.location?.municipio]
                  .filter(Boolean)
                  .join(', ') || 'No especificada'}
              </Text>

              <TouchableOpacity
                accessibilityLabel={`Iniciar escaner de cámara para la finca ${item.name}`}
                accessibilityHint="Abre el escáner de cámara para analizar plagas en este terreno"
                accessibilityRole="button"
                onPress={() => Alert.alert('Escáner Accesible', `Preparando cámara para predicción en ${item.name}...`)}
                className={`mt-4 items-center rounded-xl py-3 ${
                  isHighContrast ? 'bg-amber-400' : 'bg-slate-900'
                }`}
              >
                <Text className={`text-base font-bold ${isHighContrast ? 'text-black' : 'text-white'}`}>
                  📷 Diagnosticar Plagas en esta Finca
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                accessibilityLabel={`Ver y gestionar la finca ${item.name}`}
                accessibilityHint="Abre el detalle de la finca para editarla, eliminarla o ver sus cultivos"
                accessibilityRole="button"
                onPress={() => router.push(`/farms/${item.id}`)}
                className={`mt-3 items-center rounded-xl border py-3 ${
                  isHighContrast
                    ? 'border-amber-400 bg-black'
                    : 'border-emerald-600 bg-white'
                }`}
              >
                <Text className={`text-base font-bold ${isHighContrast ? 'text-amber-400' : 'text-emerald-700'}`}>
                  Gestión y Cultivos →
                </Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
}
