import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Button from '../../src/components/Button';
import ChipFilter from '../../src/components/ChipFilter';
import SearchBar from '../../src/components/SearchBar';
import { getCrops, type Crop } from '../../src/services/crops';
import { getFarms, type Farm } from '../../src/services/farms';
import { getSession } from '../../src/services/session';

const STAGE_COLORS: Record<string, string> = {
  vegetativo: 'bg-green-50 text-green-700',
  'floración': 'bg-sky-50 text-sky-700',
  'fructificación': 'bg-amber-50 text-amber-700',
  'producción': 'bg-violet-50 text-violet-700',
};

export default function CropsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ farmId?: string }>();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedFarm, setSelectedFarm] = useState<string | undefined>(
    typeof params.farmId === 'string' && params.farmId ? params.farmId : undefined,
  );
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      const session = await getSession();
      if (!session?.token) {
        router.replace('/login');
        return;
      }
      const [cropsData, farmsData] = await Promise.all([getCrops(), getFarms()]);
      setCrops(cropsData);
      setFarms(farmsData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar los cultivos');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectedFarmName = farms.find((f) => f.id === selectedFarm)?.name;

  const filteredCrops = crops.filter((crop) => {
    const matchesFarm = selectedFarm ? crop.farmId === selectedFarm : true;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      crop.species.toLowerCase().includes(q) ||
      (crop.farm?.name ?? '').toLowerCase().includes(q);
    return matchesFarm && matchesSearch;
  });

  const handleNew = () => {
    if (farms.length === 0) {
      Alert.alert(
        'Registra una finca primero',
        'Para crear un cultivo necesitas tener al menos una finca registrada en tu cuenta.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ir a mis fincas', onPress: () => router.push('/farms') },
        ],
      );
      return;
    }
    router.push('/crops/new');
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-neutral-50">
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral-50 p-6">
      <View className="mb-4 flex-row items-center justify-between">
        <View>
          <Text className="text-2xl font-bold text-neutral-900">Cultivos</Text>
          <Text className="text-sm text-neutral-500">
            {selectedFarmName ? `Finca: ${selectedFarmName}` : 'Todos tus cultivos'}
          </Text>
        </View>
        <Button text="+ Nuevo" onPress={handleNew} className="rounded-xl p-3" />
      </View>

      {error ? (
        <View className="mb-4 rounded-lg bg-red-50 p-3">
          <Text className="text-center text-sm font-semibold text-red-700">{error}</Text>
        </View>
      ) : null}

      {farms.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3">
          <Text className="text-center text-lg font-semibold text-neutral-700">
            Aún no tienes fincas registradas
          </Text>
          <Text className="text-center text-sm text-neutral-500">
            Registra tu primera finca para poder crear cultivos.
          </Text>
          <Button text="Ir a mis fincas" onPress={() => router.push('/farms')} />
        </View>
      ) : crops.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3">
          <Text className="text-center text-lg font-semibold text-neutral-700">
            No tienes cultivos registrados
          </Text>
          <Text className="text-center text-sm text-neutral-500">
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
            <Text className="py-6 text-center text-sm text-neutral-500">
              No se encontraron cultivos con el criterio de búsqueda.
            </Text>
          }
          renderItem={({ item }) => (
            <Pressable
              accessibilityLabel={`Cultivo ${item.species} de la finca ${item.farm?.name ?? item.farmId}`}
              accessibilityHint="Abre el detalle del cultivo para editarlo, eliminarlo o ver sus plagas"
              accessibilityRole="button"
              onPress={() => router.push(`/crops/${item.id}`)}
              className="mb-3 rounded-2xl border border-neutral-200 bg-white p-4"
            >
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold text-neutral-900">{item.species}</Text>
                <Text
                  className={`rounded-full px-2.5 py-1 text-[10px] font-bold ${
                    STAGE_COLORS[item.growthStage] ?? 'bg-neutral-100 text-neutral-600'
                  }`}
                >
                  {item.growthStage}
                </Text>
              </View>
              <Text className="mt-1 text-sm text-neutral-500">
                Finca: {item.farm?.name ?? 'No asociada'}
              </Text>
              {item.plantedDate ? (
                <Text className="mt-0.5 text-xs text-neutral-400">
                  Sembrado: {new Date(item.plantedDate).toLocaleDateString()}
                </Text>
              ) : null}
              {item.notes ? (
                <Text className="mt-1 text-xs text-neutral-500" numberOfLines={1}>
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