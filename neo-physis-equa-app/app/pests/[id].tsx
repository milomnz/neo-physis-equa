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
import { deletePest, getPest, SEVERITIES, updatePest, type Severity } from '../../src/services/pests';
import { getSession } from '../../src/services/session';

interface PestForm {
  commonName: string;
  scientificName: string;
  symptoms: string;
  severity: Severity;
}

export default function PestDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
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
  } = useForm<PestForm>();

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        const session = await getSession();
        if (!session?.token) {
          router.replace('/login');
          return;
        }
        const pest = await getPest(id);
        reset({
          commonName: pest.commonName,
          scientificName: pest.scientificName ?? '',
          symptoms: pest.symptoms.join(', '),
          severity: pest.severity,
        });
      } catch (err: unknown) {
        setScreenError(err instanceof Error ? err.message : 'Error al cargar la plaga');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router, reset]);

  const onSubmit = async (data: PestForm) => {
    if (!id) return;
    setSaving(true);
    setSaved(false);
    setScreenError('');
    try {
      const current = await getPest(id);
      const patch: Record<string, unknown> = {};
      const commonName = data.commonName.trim();
      const scientificName = data.scientificName.trim() || null;
      const symptoms = data.symptoms
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
      if (commonName !== current.commonName) patch.commonName = commonName;
      if (scientificName !== current.scientificName) patch.scientificName = scientificName;
      if (data.severity !== current.severity) patch.severity = data.severity;
      if (symptoms.join('|') !== current.symptoms.join('|')) patch.symptoms = symptoms;

      if (Object.keys(patch).length > 0) {
        await updatePest(id, patch);
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
      'Eliminar plaga',
      '¿Seguro que deseas eliminar este registro de plaga?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePest(id);
              router.back();
            } catch (err: unknown) {
              Alert.alert('Error', err instanceof Error ? err.message : 'Error al eliminar la plaga');
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

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-neutral-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView className="flex-1 p-6" contentContainerStyle={{ paddingBottom: 40 }}>
        <Text className="text-2xl font-bold text-neutral-900">Plaga</Text>
        <Text className="mb-5 text-sm text-neutral-500">Edita los datos del registro de plaga</Text>

        {saved ? (
          <View className="mb-4 rounded-lg bg-green-50 p-3">
            <Text className="text-center text-sm font-semibold text-green-700">
              Cambios guardados correctamente
            </Text>
          </View>
        ) : null}
        {screenError ? (
          <View className="mb-4 rounded-lg bg-red-50 p-3">
            <Text className="text-center text-sm font-semibold text-red-700">{screenError}</Text>
          </View>
        ) : null}
        {errors.root?.message && (
          <View className="mb-4 rounded-lg bg-red-50 p-3">
            <Text className="text-center text-sm font-semibold text-red-700">
              {errors.root.message}
            </Text>
          </View>
        )}

        <View className="mb-6 rounded-2xl border border-neutral-200 bg-white p-5">
          <Text className="mb-4 text-lg font-bold text-neutral-900">Editar datos</Text>

          <Field
            control={control}
            name="commonName"
            label="Nombre común *"
            autoCapitalize="words"
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
            multiline
            numberOfLines={3}
            rules={{
              maxLength: {
                value: 1000,
                message: 'Los síntomas deben tener máximo 1000 caracteres',
              },
            }}
          />

          <Button
            text={saving ? 'Guardando…' : 'Guardar cambios'}
            onPress={handleSubmit(onSubmit)}
            disabled={saving}
          />
        </View>

        <Button text="Eliminar plaga" secondary onPress={handleDelete} className="border-red-500" />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}