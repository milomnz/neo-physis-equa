import { ActivityIndicator, KeyboardAvoidingView, Platform, Text, View } from 'react-native';

import Button from '../../components/Button';
import Field from '../../components/Field';
import Select from '../../components/Select';
import { useAccessibility } from '../../accessibility/context';
import { SEVERITIES } from '../../services/pests';
import { useNewPest } from '../../hooks/useNewPest';

export default function NewPestScreen() {
  const { palette } = useAccessibility();
  const { control, crops, loading, rootError, onSubmit, goToCrops } = useNewPest();

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
          <Text className={`text-2xl font-bricolage ${palette.title}`}>Nueva plaga</Text>
          <Text className={`text-center ${palette.sub}`}>
            Registra una plaga asociada a un cultivo
          </Text>
        </View>

        {crops.length === 0 ? (
          <View className="gap-3">
            <Text className={`text-center ${palette.sub}`}>
              Para crear una plaga primero necesitas registrar un cultivo.
            </Text>
            <Button text="Ir a mis cultivos" onPress={goToCrops} />
          </View>
        ) : (
          <>
            {rootError && (
              <Text className={`rounded-lg p-3 text-center ${palette.errorBanner}`}>
                {rootError}
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

            <Button text="Registrar plaga" onPress={onSubmit} />
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}