import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Text, View } from 'react-native';
import { useForm } from 'react-hook-form';
import { useRouter } from 'expo-router';
import Button from '../../src/components/Button';
import Field from '../../src/components/Field';
import SearchBar from '../../src/components/SearchBar';
import { useAccessibility } from '../../src/accessibility/context';
import { createFarm, getFarms, type Farm } from '../../src/services/farms';
import { getSession } from '../../src/services/session';

interface FarmForm {
  name: string;
  vereda: string;
  municipio: string;
  altitude: string;
}

export default function FarmsScreen() {
  const router = useRouter();
  const { palette } = useAccessibility();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FarmForm>();

  const loadFarms = useCallback(async () => {
    try {
      setLoading(true);
      const userSession = await getSession();

      if (!userSession?.token) {
        router.replace('/login');
        return;
      }

      const data = await getFarms();
      setFarms(data);
    } catch (err: unknown) {
      setError('root', {
        type: 'manual',
        message: err instanceof Error ? err.message : 'Error al cargar las fincas',
      });
    } finally {
      setLoading(false);
    }
  }, [router, setError]);

  useEffect(() => {
    loadFarms();
  }, [loadFarms]);

  const onSubmit = async (data: FarmForm) => {
    setSubmitting(true);
    setSuccess('');
    try {
      await createFarm({
        name: data.name.trim(),
        location: {
          vereda: data.vereda.trim() || undefined,
          municipio: data.municipio.trim() || undefined,
        },
        altitude: parseFloat(data.altitude),
      });
      reset({ name: '', vereda: '', municipio: '', altitude: '' });
      setShowForm(false);
      setSuccess('Finca registrada correctamente.');
      loadFarms();
    } catch (err: unknown) {
      setError('root', {
        type: 'manual',
        message: err instanceof Error ? err.message : 'Error al registrar la finca',
      });
    } finally {
      setSubmitting(false);
    }
  };

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

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${palette.bg}`}>
        <ActivityIndicator color={palette.spinner} size="large" />
      </View>
    );
  }

  return (
    <View className={`flex-1 ${palette.bg} p-6`}>
      <View className="mb-5 gap-1">
        <Text className={`text-2xl font-bold ${palette.title}`}>Mis Fincas</Text>
        <Text className={`text-sm ${palette.sub}`}>
          Terrenos agrícolas para el diagnóstico de plagas
        </Text>
      </View>

      <View className="mb-5 flex-row items-center justify-between gap-3">
        <Button
          text={showForm ? 'Cancelar' : '+ Nueva finca'}
          onPress={() => setShowForm((v) => !v)}
          accessibilityLabel={showForm ? 'Cerrar formulario de registro' : 'Registrar nueva finca'}
          accessibilityHint="Muestra u oculta el formulario para inscribir un nuevo terreno agrícola"
          className="flex-1"
        />
      </View>

      {success ? (
        <View className={`mb-4 rounded-lg p-3 ${palette.successBanner}`}>
          <Text className="text-center text-sm font-semibold">{success}</Text>
        </View>
      ) : null}
      {errors.root?.message ? (
        <View className={`mb-4 rounded-lg p-3 ${palette.errorBanner}`}>
          <Text className="text-center text-sm font-semibold">{errors.root.message}</Text>
        </View>
      ) : null}

      {showForm && (
        <View className={`mb-6 gap-5 rounded-2xl p-4 ${palette.card}`}>
          <Text className={`text-xl font-bold ${palette.title}`}>Registrar finca</Text>

          <Field
            control={control}
            name="name"
            label="Nombre de la finca *"
            autoCapitalize="words"
            placeholder="ej. Finca El Paraíso"
            rules={{
              required: 'El nombre de la finca es obligatorio',
              maxLength: { value: 100, message: 'El nombre debe tener máximo 100 caracteres' },
            }}
          />
          <Field
            control={control}
            name="vereda"
            label="Vereda"
            autoCapitalize="words"
            placeholder="ej. La Esmeralda"
            rules={{ maxLength: { value: 100, message: 'La vereda debe tener máximo 100 caracteres' } }}
          />
          <Field
            control={control}
            name="municipio"
            label="Municipio"
            autoCapitalize="words"
            placeholder="ej. Armero"
            rules={{ maxLength: { value: 100, message: 'El municipio debe tener máximo 100 caracteres' } }}
          />
          <Field
            control={control}
            name="altitude"
            label="Altitud (m.s.n.m.) *"
            keyboardType="numeric"
            placeholder="ej. 1650"
            rules={{
              required: 'La altitud es obligatoria',
              validate: (value) =>
                (!isNaN(parseFloat(value)) && parseFloat(value) >= 0) ||
                'Ingresa una altitud numérica válida mayor o igual a 0',
            }}
          />

          <Button
            text={submitting ? 'Registrando…' : 'Registrar finca'}
            onPress={handleSubmit(onSubmit)}
            disabled={submitting}
          />
        </View>
      )}

      {farms.length === 0 ? (
        <View className={`flex-1 items-center justify-center gap-3 rounded-2xl p-6 ${palette.card}`}>
          <Text className={`text-lg font-semibold ${palette.title}`}>No tienes fincas registradas</Text>
          <Text className={`text-center text-sm ${palette.sub}`}>
            Registra tu primera finca para vincularla al diagnóstico de plagas.
          </Text>
          <Button text="+ Registrar finca" onPress={() => setShowForm(true)} />
        </View>
      ) : (
        <FlatList
          data={filteredFarms}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-3"
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
            <Text className={`p-6 text-center text-sm ${palette.sub}`}>
              No se encontraron fincas con el criterio de búsqueda.
            </Text>
          }
          renderItem={({ item }) => (
            <View
              accessibilityLabel={`Finca ${item.name}, altitud ${item.altitude} metros sobre el nivel del mar`}
              className={`gap-3 rounded-2xl p-4 ${palette.card}`}
            >
              <View className="flex-row items-center justify-between gap-2">
                <Text className={`flex-1 text-lg font-semibold ${palette.title}`}>{item.name}</Text>
                <Text className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${palette.chipBg}`}>
                  {item.altitude} m s. n. m.
                </Text>
              </View>

              <Text className={`text-sm ${palette.sub}`}>
                {[item.location?.vereda, item.location?.municipio]
                  .filter(Boolean)
                  .join(', ') || 'Ubicación no especificada'}
              </Text>

              <Button
                text="Diagnosticar plagas"
                onPress={() => Alert.alert('Escáner', `Preparando la cámara para analizar plagas en ${item.name}…`)}
                accessibilityLabel={`Iniciar escáner de cámara para la finca ${item.name}`}
                accessibilityHint="Abre el escáner de cámara para analizar plagas en este terreno"
              />
              <Button
                text="Ver y gestionar →"
                onPress={() => router.push(`/farms/${item.id}`)}
                secondary
                accessibilityLabel={`Ver y gestionar la finca ${item.name}`}
                accessibilityHint="Abre el detalle de la finca para editarla, eliminarla o ver sus cultivos"
              />
            </View>
          )}
        />
      )}
    </View>
  );
}