import { ActivityIndicator, ScrollView, Text, View } from 'react-native';

import Button from '../../components/Button';
import { useAccessibility } from '../../accessibility/context';
import { useFarmDetail } from '../../hooks/useFarmDetail';
import FarmFormFields from './components/FarmFormFields';

export default function FarmDetailScreen() {
  const { palette } = useAccessibility();
  const {
    farm,
    loading,
    saving,
    saved,
    screenError,
    control,
    errors,
    onSubmit,
    handleDelete,
    goToCrops,
    goToFarms,
  } = useFarmDetail();

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${palette.bg}`}>
        <ActivityIndicator color={palette.spinner} size="large" />
      </View>
    );
  }

  if (!farm) {
    return (
      <View className={`flex-1 items-center justify-center gap-4 p-6 ${palette.bg}`}>
        <Text className={`text-lg font-inter-semibold ${palette.title}`}>No se pudo cargar la finca</Text>
        {screenError ? (
          <Text className={`rounded-lg p-3 text-center text-sm ${palette.errorBanner}`}>
            {screenError}
          </Text>
        ) : null}
        <Button text="Volver a mis fincas" onPress={goToFarms} />
      </View>
    );
  }

  return (
    <ScrollView
      className={`flex-1 ${palette.bg}`}
      contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
    >
      <Text className={`text-2xl font-bricolage ${palette.title}`}>Mi finca</Text>
      <Text className={`mb-5 text-sm ${palette.sub}`}>Gestiona los datos de tu terreno agrícola</Text>

      {saved ? (
        <View className={`mb-4 rounded-lg p-3 ${palette.successBanner}`}>
          <Text className="text-center text-sm font-inter-semibold">
            Cambios guardados correctamente
          </Text>
        </View>
      ) : null}
      {screenError ? (
        <View className={`mb-4 rounded-lg p-3 ${palette.errorBanner}`}>
          <Text className="text-center text-sm font-inter-semibold">{screenError}</Text>
        </View>
      ) : null}
      {errors.root?.message ? (
        <View className={`mb-4 rounded-lg p-3 ${palette.errorBanner}`}>
          <Text className="text-center text-sm font-inter-semibold">{errors.root.message}</Text>
        </View>
      ) : null}

      <View className={`mb-6 gap-5 rounded-2xl p-4 ${palette.card}`}>
        <Text className={`text-xl font-bricolage ${palette.title}`}>Editar datos</Text>

        <FarmFormFields control={control} />

        <Button
          text={saving ? 'Guardando…' : 'Guardar cambios'}
          onPress={onSubmit}
          disabled={saving}
          accessibilityHint="Guarda los cambios de los datos de la finca"
        />
      </View>

      <View className={`mb-6 gap-2 rounded-2xl p-4 ${palette.card}`}>
        <Text className={`text-xl font-bricolage ${palette.title}`}>Cultivos de esta finca</Text>
        <Text className={`text-sm ${palette.sub}`}>
          Desde aquí puedes registrar y gestionar los cultivos sembrados en {farm.name}.
        </Text>
        <Button
          text="Ver y registrar cultivos →"
          onPress={goToCrops}
          accessibilityHint="Abre la gestión de cultivos de esta finca"
        />
      </View>

      <Button
        text="Eliminar finca"
        onPress={handleDelete}
        secondary
        accessibilityHint="Elimina la finca y todos sus datos asociados"
      />
    </ScrollView>
  );
}
