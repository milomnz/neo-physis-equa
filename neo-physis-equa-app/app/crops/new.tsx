import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import Button from '../../src/components/Button';
import Field from '../../src/components/Field';
import Select from '../../src/components/Select';
import { createCrop, GROWTH_STAGES, type GrowthStage } from '../../src/services/crops';
import { getFarms, type Farm } from '../../src/services/farms';
import { getSession } from '../../src/services/session';

interface CropForm {
  farmId: string;
  species: string;
  plantedDate: string;
  growthStage: GrowthStage;
  notes: string;
}

export default function NewCropScreen() {
  const router = useRouter();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [serverError, setServerError] = useState('');

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<CropForm>({
    defaultValues: { growthStage: 'vegetativo' },
  });

  useEffect(() => {
    (async () => {
      try {
        const session = await getSession();
        if (!session?.token) {
          router.replace('/login');
          return;
        }
        const data = await getFarms();
        setFarms(data);
      } catch (err: unknown) {
        setServerError(err instanceof Error ? err.message : 'Error al cargar las fincas');
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  const onSubmit = async (data: CropForm) => {
    setLoading(false);
    try {
      const crop = await createCrop({
        farmId: data.farmId,
        species: data.species.trim(),
        growthStage: data.growthStage,
        plantedDate: data.plantedDate.trim() || null,
        notes: data.notes.trim() || null,
      });
      router.replace(`/crops?farmId=${crop.farmId}`);
    } catch (err: unknown) {
      setError('root', {
        type: 'manual',
        message: err instanceof Error ? err.message : 'Error inesperado del servidor',
      });
    }
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-neutral-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 justify-center gap-5 p-6">
        <View className="items-center gap-1">
          <Text className="text-2xl font-bold text-neutral-900">Nuevo cultivo</Text>
          <Text className="text-center text-neutral-500">
            Registra un cultivo asociado a una de tus fincas
          </Text>
        </View>

        {farms.length === 0 ? (
          <View className="gap-3">
            <Text className="text-center text-neutral-500">
              Para crear un cultivo primero necesitas registrar una finca.
            </Text>
            <Button text="Ir a mis fincas" onPress={() => router.replace('/farms')} />
          </View>
        ) : (
          <>
            {errors.root?.message && (
              <Text className="rounded-lg bg-red-50 p-3 text-center text-red-700">
                {errors.root.message}
              </Text>
            )}
            {serverError ? (
              <Text className="rounded-lg bg-red-50 p-3 text-center text-red-700">
                {serverError}
              </Text>
            ) : null}

            <Select
              control={control}
              name="farmId"
              label="Finca *"
              options={farms.map((farm) => ({ value: farm.id, label: farm.name }))}
              empty="No tienes fincas registradas"
              rules={{ required: 'Selecciona la finca del cultivo' }}
            />

            <Field
              control={control}
              name="species"
              label="Especie *"
              autoCapitalize="words"
              placeholder="ej. Tomate, Café, Arroz"
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
              placeholder="AAAA-MM-DD (opcional)"
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
              placeholder="Observaciones del cultivo (opcional)"
              multiline
              numberOfLines={3}
              rules={{
                maxLength: {
                  value: 500,
                  message: 'Las notas deben tener máximo 500 caracteres',
                },
              }}
            />

            <Button text="Registrar cultivo" onPress={handleSubmit(onSubmit)} />
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}