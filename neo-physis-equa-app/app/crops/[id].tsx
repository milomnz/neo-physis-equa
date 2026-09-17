import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import Button from '../../src/components/Button';
import Field from '../../src/components/Field';
import Select from '../../src/components/Select';
import { useAccessibility } from '../../src/accessibility/context';
import { deleteCrop, getCrop, GROWTH_STAGES, updateCrop, type GrowthStage } from '../../src/services/crops';
import { getSession } from '../../src/services/session';

interface CropForm {
  species: string;
  plantedDate: string;
  growthStage: GrowthStage;
  notes: string;
}

export default function CropDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { palette, highContrast } = useAccessibility();
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
  } = useForm<CropForm>();

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        const session = await getSession();
        if (!session?.token) {
          router.replace('/login');
          return;
        }
        const crop = await getCrop(id);
        reset({
          species: crop.species,
          plantedDate: crop.plantedDate ? crop.plantedDate.slice(0, 10) : '',
          growthStage: crop.growthStage,
          notes: crop.notes ?? '',
        });
      } catch (err: unknown) {
        setScreenError(err instanceof Error ? err.message : 'Error al cargar el cultivo');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router, reset]);

  const onSubmit = async (data: CropForm) => {
    if (!id) return;
    setSaving(true);
    setSaved(false);
    setScreenError('');
    try {
      const current = await getCrop(id);
      const patch: Record<string, unknown> = {};
      const species = data.species.trim();
      const plantedDate = data.plantedDate.trim() || null;
      const notes = data.notes.trim() || null;
      const currentDate = current.plantedDate ? current.plantedDate.slice(0, 10) : null;
      if (species !== current.species) patch.species = species;
      if (data.growthStage !== current.growthStage) patch.growthStage = data.growthStage;
      if (plantedDate !== currentDate) patch.plantedDate = plantedDate;
      if (notes !== current.notes) patch.notes = notes;

      if (Object.keys(patch).length > 0) {
        await updateCrop(id, patch);
      }
      setSaved(true);
    } catch (err: unknown) {
      setScreenError(err instanceof Error ? err.message : 'Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = () => {
    if (!id) return;
    Alert.alert(
      'Eliminar cultivo',
      '¿Seguro que deseas eliminar este cultivo? También se eliminarán las plagas asociadas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCrop(id);
              router.back();
            } catch (err: unknown) {
              Alert.alert('Error', err instanceof Error ? err.message : 'Error al eliminar el cultivo');
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${palette.bg}`}>
        <ActivityIndicator color={palette.spinner} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className={`flex-1 ${palette.bg}`}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <Text className={`text-2xl font-bold ${palette.title}`}>Cultivo</Text>
        <Text className={`mb-5 text-sm ${palette.sub}`}>
          Edita los datos del cultivo o gestiona sus plagas
        </Text>

        {saved ? (
          <View className={`mb-4 rounded-lg p-3 ${palette.successBanner}`}>
            <Text className="text-center text-sm font-semibold">
              Cambios guardados correctamente
            </Text>
          </View>
        ) : null}
        {screenError ? (
          <View className={`mb-4 rounded-lg p-3 ${palette.errorBanner}`}>
            <Text className="text-center text-sm font-semibold">{screenError}</Text>
          </View>
        ) : null}
        {errors.root?.message && (
          <View className={`mb-4 rounded-lg p-3 ${palette.errorBanner}`}>
            <Text className="text-center text-sm font-semibold">
              {errors.root.message}
            </Text>
          </View>
        )}

        <View className={`mb-6 rounded-2xl p-5 ${palette.card}`}>
          <Text className={`mb-4 text-lg font-bold ${palette.title}`}>Editar datos</Text>

          <Field
            control={control}
            name="species"
            label="Especie *"
            autoCapitalize="words"
            rules={{
              required: 'La especie es obligatoria',
              maxLength: {
                value: 100,
                message: 'La especie debe tener máximo 100 caracteres',
              },
            }}
          />

          <Select
            control={control}
            name="growthStage"
            label="Etapa de crecimiento"
            options={GROWTH_STAGES.map((stage) => ({ value: stage, label: stage }))}
          />

          <Field
            control={control}
            name="plantedDate"
            label="Fecha de siembra"
            placeholder="AAAA-MM-DD"
            rules={{
              pattern: {
                value: /^\d{4}-\d{2}-\d{2}$/,
                message: 'Formato esperado: AAAA-MM-DD',
              },
            }}
          />

          <Field
            control={control}
            name="notes"
            label="Notas"
            multiline
            numberOfLines={3}
            rules={{
              maxLength: {
                value: 500,
                message: 'Las notas deben tener máximo 500 caracteres',
              },
            }}
          />

          <Button
            text={saving ? 'Guardando…' : 'Guardar cambios'}
            onPress={handleSubmit(onSubmit)}
            disabled={saving}
          />
        </View>

        <View className={`mb-6 rounded-2xl p-5 ${palette.card}`}>
          <Text className={`mb-1 text-lg font-bold ${palette.title}`}>Plagas de este cultivo</Text>
          <Text className={`mb-4 text-sm ${palette.sub}`}>
            Registra y gestiona las plagas que afectan este cultivo.
          </Text>
          <Button text="Ver / registrar plagas →" onPress={() => router.push(`/pests?cropId=${id}`)} />
        </View>

        <Button
          text="Eliminar cultivo"
          secondary
          onPress={handleDelete}
          className={highContrast ? undefined : 'border-red-500'}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}