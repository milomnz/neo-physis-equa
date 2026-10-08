import { ActivityIndicator, FlatList, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Button from '../../components/Button';
import ChipFilter from '../../components/ChipFilter';
import SearchBar from '../../components/SearchBar';
import { useAccessibility } from '../../accessibility/context';
import { useCropList } from '../../hooks/useCropList';

const STAGE_COLORS: Record<string, { light: string; dark: string }> = {
  vegetativo: { light: 'bg-green-50 text-green-700', dark: 'bg-green-950 text-green-300' },
  'floración': { light: 'bg-sky-50 text-sky-700', dark: 'bg-sky-950 text-sky-300' },
  'fructificación': { light: 'bg-amber-50 text-amber-700', dark: 'bg-amber-950 text-amber-300' },
  'producción': { light: 'bg-violet-50 text-violet-700', dark: 'bg-violet-950 text-violet-300' },
};

export default function CropsListScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ farmId?: string }>();
  const { palette, highContrast } = useAccessibility();
  const {
    crops,
    farms,
    filteredCrops,
    loading,
    error,
    search,
    setSearch,
    selectedFarm,
    setSelectedFarm,
    selectedFarmName,
    goToNew,
  } = useCropList(typeof params.farmId === 'string' ? params.farmId : undefined);

  if (loading) {
    return (
      <View className={`flex-1 items-center justify-center ${palette.bg}`}>
        <ActivityIndicator color={palette.spinner} />
      </View>
    );
  }

  return (
    <View className={`flex-1 ${palette.bg} p-6`}>
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className={`text-2xl font-bricolage ${palette.title}`}>Cultivos</Text>
          <Text className={`text-sm ${palette.sub}`}>
            {selectedFarmName ? `Finca: ${selectedFarmName}` : 'Todos tus cultivos'}
          </Text>
        </View>
        <Button text="+ Nuevo" onPress={goToNew} className="rounded-xl p-3" />
      </View>

      {error ? (
        <View className={`mb-4 rounded-lg p-3 ${palette.errorBanner}`}>
          <Text className="text-center text-sm font-inter-semibold">{error}</Text>
        </View>
      ) : null}

      {farms.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3">
          <Text className={`text-center text-lg font-inter-semibold ${palette.body}`}>
            Aún no tienes fincas registradas
          </Text>
          <Text className={`text-center text-sm ${palette.sub}`}>
            Registra tu primera finca para poder crear cultivos.
          </Text>
          <Button text="Ir a mis fincas" onPress={() => router.push('/farms')} />
        </View>
      ) : crops.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3">
          <Text className={`text-center text-lg font-inter-semibold ${palette.body}`}>
            No tienes cultivos registrados
          </Text>
          <Text className={`text-center text-sm ${palette.sub}`}>
            Crea tu primer cultivo para empezar a registrar plagas.
          </Text>
          <Button text="+ Registrar cultivo" onPress={() => router.push('/crops/new')} />
        </View>
      ) : (
        <FlatList
          data={filteredCrops}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              <SearchBar
                value={search}
                onChangeText={setSearch}
                placeholder="Buscar cultivo por especie o finca"
              />
              <ChipFilter
                label="Filtrar por finca"
                options={farms.map((farm) => ({ value: farm.id, label: farm.name }))}
                selected={selectedFarm}
                onSelect={setSelectedFarm}
              />
            </>
          }
          ListEmptyComponent={
            <Text className={`py-6 text-center text-sm ${palette.sub}`}>
              No se encontraron cultivos con el criterio de búsqueda.
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              accessibilityLabel={`Cultivo ${item.species} de la finca ${item.farm?.name ?? item.farmId}`}
              accessibilityHint="Abre el detalle del cultivo para editarlo, eliminarlo o ver sus plagas"
              accessibilityRole="button"
              onPress={() => router.push(`/crops/${item.id}`)}
              className={`mb-3 rounded-2xl p-4 ${palette.card}`}
            >
              <View className="flex-row items-center justify-between">
                <Text className={`text-lg font-inter-semibold ${palette.title}`}>{item.species}</Text>
                <Text
                  className={`rounded-full px-2.5 py-1 text-[10px] font-inter-bold ${
                    STAGE_COLORS[item.growthStage]
                      ? highContrast
                        ? STAGE_COLORS[item.growthStage].dark
                        : STAGE_COLORS[item.growthStage].light
                      : highContrast
                        ? 'bg-turquesa text-crema'
                        : 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {item.growthStage}
                </Text>
              </View>
              <Text className={`mt-1 text-sm ${palette.sub}`}>
                Finca: {item.farm?.name ?? 'No asociada'}
              </Text>
              {item.plantedDate ? (
                <Text className={`mt-0.5 text-xs ${palette.faint}`}>
                  Sembrado: {new Date(item.plantedDate).toLocaleDateString()}
                </Text>
              ) : null}
              {item.notes ? (
                <Text className={`mt-1 text-xs ${palette.sub}`} numberOfLines={1}>
                  Notas: {item.notes}
                </Text>
              ) : null}
            </Pressable>
          )}
        />
      )}
    </View>
  );
}
