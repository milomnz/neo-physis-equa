import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import type { Control } from 'react-hook-form';
import Button from '../../components/Button';
import Select from '../../components/Select';
import { useAccessibility } from '../../accessibility/context';
import { useNewCrop } from '../../hooks/useNewCrop';
import CropFormFields from './CropFormFields';
import { FARM_FIELD_RULES, type CropFormValues } from './validators';

export default function NewCropScreen() {
  const { palette } = useAccessibility();
  const { control, farms, loading, loadError, submitting, rootError, onSubmit, goToFarms } =
    useNewCrop();

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
            <Button text="Ir a mis fincas" onPress={goToFarms} />
          </View>
        ) : (
          <>
            {rootError && (
              <Text className={`rounded-lg p-3 text-center ${palette.errorBanner}`}>
                {rootError}
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

            <Button
              text={submitting ? 'Registrando…' : 'Registrar cultivo'}
              onPress={onSubmit}
              disabled={submitting}
            />
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}
