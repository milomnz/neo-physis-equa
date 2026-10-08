import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Button from '../../components/Button';
import { useAccessibility } from '../../accessibility/context';
import { useCropDetail } from '../../hooks/useCropDetail';
import CropFormFields from './CropFormFields';

export default function CropDetailScreen() {
  const params = useLocalSearchParams<{ id: string }>();
  const id = typeof params.id === 'string' ? params.id : undefined;
  const router = useRouter();
  const { palette } = useAccessibility();

  const { control, loading, saving, saved, error, onSubmit, confirmDelete } = useCropDetail(id);

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
        <Text className={`text-2xl font-bricolage ${palette.title}`}>Cultivo</Text>
        <Text className={`mb-5 text-sm ${palette.sub}`}>
          Edita los datos del cultivo o gestiona sus plagas
        </Text>

        {saved ? (
          <View className={`mb-4 rounded-lg p-3 ${palette.successBanner}`}>
            <Text className="text-center text-sm font-inter-semibold">
              Cambios guardados correctamente
            </Text>
          </View>
        ) : null}
        {error ? (
          <View className={`mb-4 rounded-lg p-3 ${palette.errorBanner}`}>
            <Text className="text-center text-sm font-inter-semibold">{error}</Text>
          </View>
        ) : null}

        <View className={`mb-6 rounded-2xl p-5 ${palette.card}`}>
          <Text className={`mb-4 text-lg font-bricolage ${palette.title}`}>Editar datos</Text>

          <CropFormFields control={control} />

          <Button
            text={saving ? 'Guardando…' : 'Guardar cambios'}
            onPress={onSubmit}
            disabled={saving}
          />
        </View>

        <View className={`mb-6 rounded-2xl p-5 ${palette.card}`}>
          <Text className={`mb-1 text-lg font-bricolage ${palette.title}`}>Plagas de este cultivo</Text>
          <Text className={`mb-4 text-sm ${palette.sub}`}>
            Registra y gestiona las plagas que afectan este cultivo.
          </Text>
          <Button text="Ver / registrar plagas →" onPress={() => router.push(`/pests?cropId=${id}`)} />
        </View>

        <Button text="Eliminar cultivo" danger onPress={confirmDelete} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
