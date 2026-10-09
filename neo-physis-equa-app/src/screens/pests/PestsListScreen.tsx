import { ActivityIndicator, FlatList, Text, View } from 'react-native';

import Button from '../../components/Button';
import ChipFilter from '../../components/ChipFilter';
import SearchBar from '../../components/SearchBar';
import { useAccessibility } from '../../accessibility/context';
import { usePestList } from '../../hooks/usePestList';
import PestCard from './components/PestCard';

export default function PestsListScreen() {
  const { palette } = useAccessibility();
  const {
    filteredPests,
    crops,
    loading,
    error,
    search,
    setSearch,
    selectedCrop,
    setSelectedCrop,
    selectedCropLabel,
    goToNew,
    goToDetail,
    goToCrops,
  } = usePestList();

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
          <Text className={`text-2xl font-bricolage ${palette.title}`}>Plagas</Text>
          <Text className={`text-sm ${palette.sub}`}>
            {selectedCropLabel ? `Cultivo: ${selectedCropLabel}` : 'Plagas de tus cultivos'}
          </Text>
        </View>
        <Button text="+ Nueva" onPress={goToNew} className="rounded-xl p-3" />
      </View>

      {error ? (
        <View className={`mb-4 rounded-lg p-3 ${palette.errorBanner}`}>
          <Text className="text-center text-sm font-inter-semibold">{error}</Text>
        </View>
      ) : null}

      {crops.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3">
          <Text className={`text-center text-lg font-inter-semibold ${palette.body}`}>
            Aún no tienes cultivos registrados
          </Text>
          <Text className={`text-center text-sm ${palette.sub}`}>
            Crea tu primer cultivo para poder registrar plagas.
          </Text>
          <Button text="Ir a mis cultivos" onPress={goToCrops} />
        </View>
      ) : (
        <FlatList
          data={filteredPests}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <>
              <SearchBar
                value={search}
                onChangeText={setSearch}
                placeholder="Buscar plaga por nombre o cultivo"
              />
              <ChipFilter
                label="Filtrar por cultivo"
                options={crops.map((crop) => ({ value: crop.id, label: crop.species }))}
                selected={selectedCrop}
                onSelect={setSelectedCrop}
              />
            </>
          }
          ListEmptyComponent={
            <Text className={`py-6 text-center text-sm ${palette.sub}`}>
              No se encontraron plagas con el criterio de búsqueda.
            </Text>
          }
          renderItem={({ item }) => <PestCard pest={item} onPress={(pest) => goToDetail(pest.id)} />}
        />
      )}
    </View>
  );
}