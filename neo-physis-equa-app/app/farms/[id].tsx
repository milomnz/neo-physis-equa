import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import Button from '../../src/components/Button';
import Field from '../../src/components/Field';
import { deleteFarm, getFarm, updateFarm, type Farm } from '../../src/services/farms';
import { getSession, type Session } from '../../src/services/session';

interface FarmForm {
  name: string;
  vereda: string;
  municipio: string;
  altitude: string;
}

export default function FarmDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [farm, setFarm] = useState<Farm | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [screenError, setScreenError] = useState('');
  const [saved, setSaved] = useState(false);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<FarmForm>();

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        const userSession = await getSession();
        setSession(userSession);
        if (!userSession?.token) {
          router.replace('/login');
          return;
        }
        const data = await getFarm(id);
        setFarm(data);
        reset({
          name: data.name,
          vereda: data.location?.vereda ?? '',
          municipio: data.location?.municipio ?? '',
          altitude: String(data.altitude ?? ''),
        });
      } catch (err: unknown) {
        setScreenError(err instanceof Error ? err.message : 'Error al cargar la finca');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router, reset]);

  const onSubmit = async (data: FarmForm) => {
    if (!farm) return;
    setSaving(true);
    setSaved(false);
    setScreenError('');
    try {
      const patch: Record<string, unknown> = {};
      const name = data.name.trim();
      const parsedAltitude = parseFloat(data.altitude);
      if (name !== farm.name) patch.name = name;

      const newLocation: Record<string, string> = {};
      if (data.vereda.trim() !== (farm.location?.vereda ?? '')) newLocation.vereda = data.vereda.trim();
      if (data.municipio.trim() !== (farm.location?.municipio ?? '')) newLocation.municipio = data.municipio.trim();
      if (Object.keys(newLocation).length > 0) patch.location = { ...(farm.location ?? {}), ...newLocation };

      if (parsedAltitude !== farm.altitude) patch.altitude = parsedAltitude;

      if (Object.keys(patch).length === 0) {
        reset({
          name,
          vereda: data.vereda.trim(),
          municipio: data.municipio.trim(),
          altitude: data.altitude,
        });
        setSaved(true);
        return;
      }

      const updated = await updateFarm(farm.id, patch);
      setFarm(updated);
      reset({
        name: updated.name,
        vereda: updated.location?.vereda ?? '',
        municipio: updated.location?.municipio ?? '',
        altitude: String(updated.altitude ?? ''),
      });
      setSaved(true);
    } catch (err: unknown) {
      setScreenError(err instanceof Error ? err.message : 'Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!farm) return;
    Alert.alert(
      'Eliminar finca',
      `¿Seguro que deseas eliminar la finca "${farm.name}"? Esta acción eliminará también sus cultivos y plagas asociadas.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteFarm(farm.id);
              router.replace('/farms');
            } catch (err: unknown) {
              Alert.alert('Error', err instanceof Error ? err.message : 'Error al eliminar la finca');
            }
          },
        },
      ],
    );
  };

  const isHighContrast = session?.accessibilityProfile?.highContrast === true;

  const containerBg = isHighContrast ? 'bg-black' : 'bg-neutral-50';
  const cardBg = isHighContrast ? 'bg-zinc-900 border-2 border-amber-400' : 'bg-white border border-neutral-200';
  const textColor = isHighContrast ? 'text-amber-400' : 'text-neutral-900';
  const subTextColor = isHighContrast ? 'text-zinc-300' : 'text-neutral-500';
  const inputClassName = isHighContrast
    ? 'rounded-xl border border-amber-400 bg-black text-amber-400 p-3.5'
    : undefined;
  const labelClassName = isHighContrast ? 'text-amber-400' : undefined;
  const errorBanner = isHighContrast ? 'bg-red-950 text-red-400' : 'bg-red-50 text-red-700';

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${containerBg}`}>
        <ActivityIndicator color={isHighContrast ? '#fbbf24' : '#2563eb'} size="large" />
      </View>
    );
  }

  if (!farm) {
    return (
      <View className={`flex-1 items-center justify-center gap-4 p-6 ${containerBg}`}>
        <Text className={`text-lg font-semibold ${textColor}`}>No se pudo cargar la finca</Text>
        {screenError ? <Text className={`rounded-lg p-3 text-center text-sm ${errorBanner}`}>{screenError}</Text> : null}
        <Button text="Volver a mis fincas" onPress={() => router.replace('/farms')} variant={isHighContrast ? 'amber' : undefined} />
      </View>
    );
  }

  return (
    <ScrollView
      className={`flex-1 ${containerBg}`}
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
    >
      <Text className={`text-2xl font-bold ${textColor}`}>Mi finca</Text>
      <Text className={`mb-5 text-sm ${subTextColor}`}>Gestiona los datos de tu terreno agrícola</Text>

      {saved ? (
        <View className="mb-4 rounded-lg bg-green-50 p-3">
          <Text className="text-center text-sm font-semibold text-green-700">
            Cambios guardados correctamente
          </Text>
        </View>
      ) : null}
      {screenError ? (
        <View className={`mb-4 rounded-lg p-3 ${errorBanner}`}>
          <Text className="text-center text-sm font-semibold">{screenError}</Text>
        </View>
      ) : null}
      {errors.root?.message ? (
        <View className={`mb-4 rounded-lg p-3 ${errorBanner}`}>
          <Text className="text-center text-sm font-semibold">{errors.root.message}</Text>
        </View>
      ) : null}

      <View className={`mb-6 gap-5 rounded-2xl p-4 ${cardBg}`}>
        <Text className={`text-xl font-bold ${textColor}`}>Editar datos</Text>

        <Field
          control={control}
          name="name"
          label="Nombre de la finca *"
          autoCapitalize="words"
          className={inputClassName}
          labelClassName={labelClassName}
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
          className={inputClassName}
          labelClassName={labelClassName}
          rules={{ maxLength: { value: 100, message: 'La vereda debe tener máximo 100 caracteres' } }}
        />
        <Field
          control={control}
          name="municipio"
          label="Municipio"
          autoCapitalize="words"
          className={inputClassName}
          labelClassName={labelClassName}
          rules={{ maxLength: { value: 100, message: 'El municipio debe tener máximo 100 caracteres' } }}
        />
        <Field
          control={control}
          name="altitude"
          label="Altitud (m.s.n.m.) *"
          keyboardType="numeric"
          className={inputClassName}
          labelClassName={labelClassName}
          rules={{
            required: 'La altitud es obligatoria',
            validate: (value) =>
              (!isNaN(parseFloat(value)) && parseFloat(value) >= 0) ||
              'Ingresa una altitud numérica válida mayor o igual a 0',
          }}
        />

        <Button
          text={saving ? 'Guardando…' : 'Guardar cambios'}
          onPress={handleSubmit(onSubmit)}
          disabled={saving}
          variant={isHighContrast ? 'amber' : undefined}
          accessibilityHint="Guarda los cambios de los datos de la finca"
        />
      </View>

      <View className={`mb-6 gap-2 rounded-2xl p-4 ${cardBg}`}>
        <Text className={`text-xl font-bold ${textColor}`}>Cultivos de esta finca</Text>
        <Text className={`text-sm ${subTextColor}`}>
          Desde aquí puedes registrar y gestionar los cultivos sembrados en {farm.name}.
        </Text>
        <Button
          text="Ver y registrar cultivos →"
          onPress={() => router.push(`/crops?farmId=${farm.id}`)}
          variant={isHighContrast ? 'amber' : undefined}
          accessibilityHint="Abre la gestión de cultivos de esta finca"
        />
      </View>

      <Button
        text="Eliminar finca"
        onPress={handleDelete}
        secondary
        variant={isHighContrast ? 'amberOutline' : undefined}
        className={isHighContrast ? undefined : 'border-red-500'}
        accessibilityHint="Elimina la finca y todos sus datos asociados"
      />
    </ScrollView>
  );
}