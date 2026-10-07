import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useForm, type Control } from 'react-hook-form';
import Button from '../Button';
import Select from '../Select';
import { useAccessibility } from '../../accessibility/context';
import CropFormFields from './CropFormFields';
import { useNewCrop } from './useNewCrop';
import { FARM_FIELD_RULES, type CropFormValues, type NewCropFormValues } from './validators';

export default function NewCropScreen() {
  const router = useRouter();
  const { palette } = useAccessibility();
  const { farms, loading, loadError, submit } = useNewCrop();

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<NewCropFormValues>({
    defaultValues: { growthStage: 'vegetativo' },
  });

  const onSubmit = async (data: NewCropFormValues) => {
    const message = await submit(data);
    if (message) {
      setError('root', { type: 'manual', message });
    }
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
      <View className="flex-1 justify-center gap-5 p-6">
        <View className="items-center gap-1">
          <Text className={`text-2xl font-bricolage ${palette.title}`}>Nuevo cultivo</Text>
          <Text className={`text-center ${palette.sub}`}>
            Registra un cultivo asociado a una de tus fincas
          </Text>
        </View>

        {farms.length === 0 ? (
          <View className="gap-3">
            <Text className={`text-center ${palette.sub}`}>
              Para crear un cultivo primero necesitas registrar una finca.
            </Text>
            <Button text="Ir a mis fincas" onPress={() => router.replace('/farms')} />
          </View>
        ) : (
          <>
            {errors.root?.message && (
              <Text className={`rounded-lg p-3 text-center ${palette.errorBanner}`}>
                {errors.root.message}
              </Text>
            )}
            {loadError ? (
              <Text className={`rounded-lg p-3 text-center ${palette.errorBanner}`}>
                {loadError}
              </Text>
            ) : null}

            <Select
              control={control}
              name="farmId"
              label="Finca *"
              options={farms.map((farm) => ({ value: farm.id, label: farm.name }))}
              empty="No tienes fincas registradas"
              rules={FARM_FIELD_RULES}
            />

            {/* NewCropFormValues extiende CropFormValues; los campos compartidos son compatibles */}
            <CropFormFields control={control as unknown as Control<CropFormValues>} optionalHints />

            <Button text="Registrar cultivo" onPress={handleSubmit(onSubmit)} />
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
