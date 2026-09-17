import { useEffect, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import Button from '../../src/components/Button';
import Field from '../../src/components/Field';
import Select from '../../src/components/Select';
import { getCrops, type Crop } from '../../src/services/crops';
import { createPest, SEVERITIES, type Severity } from '../../src/services/pests';
import { getSession } from '../../src/services/session';

interface PestForm {
  cropId: string;
  commonName: string;
  scientificName: string;
  symptoms: string;
  severity: Severity;
}

export default function NewPestScreen() {
  const router = useRouter();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<PestForm>({
    defaultValues: { severity: 'media' },
  });

  useEffect(() => {
    (async () => {
      try {
        const session = await getSession();
        if (!session?.token) {
          router.replace('/login');
          return;
        }
        const data = await getCrops();
        setCrops(data);
      } catch (err: unknown) {
        setError('root', {
          type: 'manual',
          message: err instanceof Error ? err.message : 'Error al cargar los cultivos',
        });
      } finally {
        setLoading(false);
      }
    })();
  }, [router, setError]);

  const onSubmit = async (data: PestForm) => {
    try {
      const pest = await createPest({
        cropId: data.cropId,
        commonName: data.commonName.trim(),
        scientificName: data.scientificName.trim() || null,
        severity: data.severity,
        symptoms: data.symptoms
          .split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      });
      router.replace(`/pests?cropId=${pest.cropId}`);
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
          <Text className="text-2xl font-bold text-neutral-900">Nueva plaga</Text>
          <Text className="text-center text-neutral-500">
            Registra una plaga asociada a un cultivo
          </Text>
        </View>

        {crops.length === 0 ? (
          <View className="gap-3">
            <Text className="text-center text-neutral-500">
              Para crear una plaga primero necesitas registrar un cultivo.
            </Text>
            <Button text="Ir a mis cultivos" onPress={() => router.replace('/crops')} />
          </View>
        ) : (
          <>
            {errors.root?.message && (
              <Text className="rounded-lg bg-red-50 p-3 text-center text-red-700">
                {errors.root.message}
              </Text>
            )}

            <Select
              control={control}
              name="cropId"
              label="Cultivo *"
              options={crops.map((crop) => ({
                value: crop.id,
                label: `${crop.species} (${crop.farm?.name ?? 'sin finca'})`,
              }))}
              empty="No tienes cultivos registrados"
              rules={{ required: 'Selecciona el cultivo afectado' }}
            />

            <Field
              control={control}
              name="commonName"
              label="Nombre común *"
              autoCapitalize="words"
              placeholder="ej. Pulgón, Gusano cogollero"
              rules={{
                required: 'El nombre común es obligatorio',
                maxLength: {
                  value: 100,
                  message: 'El nombre debe tener máximo 100 caracteres',
                },
              }}
            />

            <Field
              control={control}
              name="scientificName"
              label="Nombre científico"
              autoCapitalize="words"
              placeholder="ej. Aphis gossypii (opcional)"
              rules={{
                maxLength: {
                  value: 200,
                  message: 'El nombre científico debe tener máximo 200 caracteres',
                },
              }}
            />

            <Select
              control={control}
              name="severity"
              label="Severidad"
              options={SEVERITIES.map((severity) => ({
                value: severity,
                label: severity.charAt(0).toUpperCase() + severity.slice(1),
              }))}
            />

            <Field
              control={control}
              name="symptoms"
              label="Síntomas (separados por coma)"
              placeholder="ej. hojas enrolladas, manchas, mordeduras"
              multiline
              numberOfLines={3}
              rules={{
                maxLength: {
                  value: 1000,
                  message: 'Los síntomas deben tener máximo 1000 caracteres',
                },
              }}
            />

            <Button text="Registrar plaga" onPress={handleSubmit(onSubmit)} />
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}