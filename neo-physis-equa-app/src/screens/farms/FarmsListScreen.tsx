import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import Button from '../../components/Button';
import SearchBar from '../../components/SearchBar';
import { useAccessibility } from '../../accessibility/context';
import { useFarmList } from '../../hooks/useFarmList';
import FarmCard from './components/FarmCard';
import FarmFormFields from './components/FarmFormFields';

export default function FarmsListScreen() {
  const { palette } = useAccessibility();
  const {
    farms,
    filteredFarms,
    loading,
    showForm,
    setShowForm,
    search,
    setSearch,
    success,
    submitting,
    control,
    errors,
    handleSubmit,
    onSubmit,
    goToDetail,
    openScanner,
  } = useFarmList();

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${palette.bg}`}>
        <ActivityIndicator color={palette.spinner} size="large" />
      </View>
    );
  }

  return (
    <View className={`flex-1 ${palette.bg} p-6`}>
      <View className="mb-5 gap-1">
        <Text className={`text-2xl font-bricolage ${palette.title}`}>Mis Fincas</Text>
        <Text className={`text-sm ${palette.sub}`}>
          Terrenos agrícolas para el diagnóstico de plagas
        </Text>
      </View>

      <View className="mb-5 flex-row items-center justify-between gap-3">
        <Button
          text={showForm ? 'Cancelar' : '+ Nueva finca'}
          onPress={() => setShowForm((v) => !v)}
          accessibilityLabel={showForm ? 'Cerrar formulario de registro' : 'Registrar nueva finca'}
          accessibilityHint="Muestra u oculta el formulario para inscribir un nuevo terreno agrícola"
          className="flex-1"
        />
      </View>

      {success ? (
        <View className={`mb-4 rounded-lg p-3 ${palette.successBanner}`}>
          <Text className="text-center text-sm font-inter-semibold">{success}</Text>
        </View>
      ) : null}
      {errors.root?.message ? (
        <View className={`mb-4 rounded-lg p-3 ${palette.errorBanner}`}>
          <Text className="text-center text-sm font-inter-semibold">{errors.root.message}</Text>
        </View>
      ) : null}

      {showForm ? (
        <View className={`mb-6 gap-5 rounded-2xl p-4 ${palette.card}`}>
          <Text className={`text-xl font-bricolage ${palette.title}`}>Registrar finca</Text>

          <FarmFormFields control={control} withPlaceholders />

          <Button
            text={submitting ? 'Registrando…' : 'Registrar finca'}
            onPress={handleSubmit(onSubmit)}
            disabled={submitting}
          />
        </View>
      ) : farms.length === 0 ? (
        <View className={`flex-1 items-center justify-center gap-3 rounded-2xl p-6 ${palette.card}`}>
          <Text className={`text-lg font-inter-semibold ${palette.title}`}>No tienes fincas registradas</Text>
          <Text className={`text-center text-sm ${palette.sub}`}>
            Registra tu primera finca para vincularla al diagnóstico de plagas.
          </Text>
          <Button text="+ Registrar finca" onPress={() => setShowForm(true)} />
        </View>
      ) : (
        <FlatList
          data={filteredFarms}
          keyExtractor={(item) => item.id}
          contentContainerClassName="gap-3"
          ListHeaderComponent={
            farms.length > 1 || filteredFarms.length === 0 ? (
              <SearchBar
                value={search}
                onChangeText={setSearch}
                placeholder="Buscar finca por nombre o ubicación"
              />
            ) : null
          }
          ListEmptyComponent={
            <Text className={`p-6 text-center text-sm ${palette.sub}`}>
              No se encontraron fincas con el criterio de búsqueda.
            </Text>
          }
          renderItem={({ item }) => (
            <FarmCard farm={item} onScan={openScanner} onOpen={(farm) => goToDetail(farm.id)} />
          )}
        />
      )}
    </View>
  );
}
