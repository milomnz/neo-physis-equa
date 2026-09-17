import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Button from '../../src/components/Button';
import { deleteFarm, getFarm, updateFarm, type Farm } from '../../src/services/farms';
import { getSession } from '../../src/services/session';

interface EditForm {
  name: string;
  vereda: string;
  municipio: string;
  altitude: string;
}

export default function FarmDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [farm, setFarm] = useState<Farm | null>(null);
  const [form, setForm] = useState<EditForm>({
    name: '',
    vereda: '',
    municipio: '',
    altitude: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  const loadFarm = useCallback(async () => {
    if (!id) return;
    try {
      const session = await getSession();
      if (!session?.token) {
        router.replace('/login');
        return;
      }
      const data = await getFarm(id);
      setFarm(data);
      setForm({
        name: data.name,
        vereda: data.location?.vereda ?? '',
        municipio: data.location?.municipio ?? '',
        altitude: String(data.altitude ?? ''),
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar la finca');
    } finally {
      setLoading(false);
    }
  }, [id, router]);

  useEffect(() => {
    loadFarm();
  }, [loadFarm]);

  const handleSave = async () => {
    if (!farm) return;
    const name = form.name.trim();
    if (!name) {
      setSaved(false);
      setError('El nombre de la finca es obligatorio');
      return;
    }
    const parsedAltitude = parseFloat(form.altitude);
    if (isNaN(parsedAltitude) || parsedAltitude < 0) {
      setError('La altitud debe ser un número válido mayor o igual a 0');
      return;
    }

    const patch: Record<string, unknown> = {};
    if (name !== farm.name) patch.name = name;
    const newLocation: Record<string, string> = {};
    if (form.vereda.trim() !== (farm.location?.vereda ?? '')) newLocation.vereda = form.vereda.trim();
    if (form.municipio.trim() !== (farm.location?.municipio ?? '')) newLocation.municipio = form.municipio.trim();
    if (Object.keys(newLocation).length > 0) patch.location = { ...(farm.location ?? {}), ...newLocation };
    if (parsedAltitude !== farm.altitude) patch.altitude = parsedAltitude;

    if (Object.keys(patch).length === 0) {
      setError('');
      setSaved(true);
      return;
    }

    try {
      setSaving(true);
      const updated = await updateFarm(farm.id, patch);
      setFarm(updated);
      setForm({
        name: updated.name,
        vereda: updated.location?.vereda ?? '',
        municipio: updated.location?.municipio ?? '',
        altitude: String(updated.altitude ?? ''),
      });
      setError('');
      setSaved(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar los cambios');
      setSaved(false);
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

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50">
        <ActivityIndicator />
      </View>
    );
  }

  if (!farm) {
    return (
      <View className="flex-1 items-center justify-center gap-4 bg-neutral-50 p-6">
        <Text className="text-lg font-semibold text-neutral-900">No se pudo cargar la finca</Text>
        {error ? <Text className="text-center text-sm text-red-600">{error}</Text> : null}
        <Button text="Volver a mis fincas" onPress={() => router.replace('/farms')} />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-neutral-50 p-6" contentContainerStyle={{ paddingBottom: 40 }}>
      <Text className="text-2xl font-bold text-neutral-900">Finca</Text>
      <Text className="mb-5 text-sm text-neutral-500">Gestiona los datos de tu terreno agrícola</Text>

      {saved ? (
        <View className="mb-4 rounded-lg bg-green-50 p-3">
          <Text className="text-center text-sm font-semibold text-green-700">
            Cambios guardados correctamente
          </Text>
        </View>
      ) : null}
      {error ? (
        <View className="mb-4 rounded-lg bg-red-50 p-3">
          <Text className="text-center text-sm font-semibold text-red-700">{error}</Text>
        </View>
      ) : null}

      <View className="mb-6 rounded-2xl border border-neutral-200 bg-white p-5">
        <Text className="mb-4 text-lg font-bold text-neutral-900">Editar datos</Text>

        <Text className="mb-1.5 font-semibold text-neutral-700">Nombre de la finca *</Text>
        <TextInput
          accessibilityLabel="Nombre de la finca"
          value={form.name}
          onChangeText={(text) => {
            setForm((f) => ({ ...f, name: text }));
            setSaved(false);
            setError('');
          }}
          placeholder="ej. Finca El Paraíso"
          placeholderTextColor="#a3a3a3"
          className="mb-4 rounded-xl border border-neutral-300 bg-white p-3.5"
        />

        <View className="mb-4 flex-row gap-3">
          <View className="flex-1">
            <Text className="mb-1.5 font-semibold text-neutral-700">Vereda</Text>
            <TextInput
              accessibilityLabel="Vereda"
              value={form.vereda}
              onChangeText={(text) => {
                setForm((f) => ({ ...f, vereda: text }));
                setSaved(false);
                setError('');
              }}
              placeholder="ej. La Esmeralda"
              placeholderTextColor="#a3a3a3"
              className="rounded-xl border border-neutral-300 bg-white p-3.5"
            />
          </View>
          <View className="flex-1">
            <Text className="mb-1.5 font-semibold text-neutral-700">Municipio</Text>
            <TextInput
              accessibilityLabel="Municipio"
              value={form.municipio}
              onChangeText={(text) => {
                setForm((f) => ({ ...f, municipio: text }));
                setSaved(false);
                setError('');
              }}
              placeholder="ej. Armero"
              placeholderTextColor="#a3a3a3"
              className="rounded-xl border border-neutral-300 bg-white p-3.5"
            />
          </View>
        </View>

        <Text className="mb-1.5 font-semibold text-neutral-700">Altitud (m.s.n.m.) *</Text>
        <TextInput
          accessibilityLabel="Altitud en metros sobre el nivel del mar"
          value={form.altitude}
          onChangeText={(text) => {
            setForm((f) => ({ ...f, altitude: text }));
            setSaved(false);
            setError('');
          }}
          keyboardType="numeric"
          placeholder="ej. 1650"
          placeholderTextColor="#a3a3a3"
          className="mb-6 rounded-xl border border-neutral-300 bg-white p-3.5"
        />

        <Button
          text={saving ? 'Guardando…' : 'Guardar cambios'}
          onPress={handleSave}
          disabled={saving}
        />
      </View>

      <View className="mb-6 rounded-2xl border border-neutral-200 bg-white p-5">
        <Text className="mb-1 text-lg font-bold text-neutral-900">Cultivos de esta finca</Text>
        <Text className="mb-4 text-sm text-neutral-500">
          Desde aquí puedes registrar y gestionar los cultivos sembrados en {farm.name}.
        </Text>
        <Button text="Ver / registrar cultivos →" onPress={() => router.push(`/crops?farmId=${farm.id}`)} />
      </View>

      <Button
        text="Eliminar finca"
        secondary
        onPress={handleDelete}
        className="border-red-500"
      />
    </ScrollView>
  );
}