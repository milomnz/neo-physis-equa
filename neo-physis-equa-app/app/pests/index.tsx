import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, Text, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Badge from '../../src/components/Badge';
import Button from '../../src/components/Button';
import ChipFilter from '../../src/components/ChipFilter';
import SearchBar from '../../src/components/SearchBar';
import { useAccessibility } from '../../src/accessibility/context';
import { getCrops, type Crop } from '../../src/services/crops';
import { getPests, type Pest } from '../../src/services/pests';
import { getSession } from '../../src/services/session';

export default function PestsScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ cropId?: string }>();
  const { palette } = useAccessibility();
  const [pests, setPests] = useState<Pest[]>([]);
  const [crops, setCrops] = useState<Crop[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCrop, setSelectedCrop] = useState<string | undefined>(
    typeof params.cropId === 'string' && params.cropId ? params.cropId : undefined,
  );
  const [error, setError] = useState('');

  const loadData = useCallback(async () => {
    try {
      const session = await getSession();
      if (!session?.token) {
        router.replace('/login');
        return;
      }
      const [pestsData, cropsData] = await Promise.all([getPests(), getCrops()]);
      setPests(pestsData);
      setCrops(cropsData);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al cargar las plagas');
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const selectedCropLabel = crops.find((c) => c.id === selectedCrop)?.species;

  const filteredPests = pests.filter((pest) => {
    const matchesCrop = selectedCrop ? pest.cropId === selectedCrop : true;
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      pest.commonName.toLowerCase().includes(q) ||
      (pest.scientificName ?? '').toLowerCase().includes(q) ||
      (pest.crop?.species ?? '').toLowerCase().includes(q);
    return matchesCrop && matchesSearch;
  });

  const handleNew = () => {
    if (crops.length === 0) {
      Alert.alert(
        'Registra un cultivo primero',
        'Para crear una plaga necesitas tener al menos un cultivo registrado.',
        [
          { text: 'Cancelar', style: 'cancel' },
          { text: 'Ir a mis cultivos', onPress: () => router.push('/crops') },
        ],
      );
      return;
    }
    router.push('/pests/new');
  };

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
          <Text className={`text-2xl font-bold ${palette.title}`}>Plagas</Text>
          <Text className={`text-sm ${palette.sub}`}>
            {selectedCropLabel ? `Cultivo: ${selectedCropLabel}` : 'Plagas de tus cultivos'}
          </Text>
        </View>
        <Button text="+ Nueva" onPress={handleNew} className="rounded-xl p-3" />
      </View>

      {error ? (
        <View className={`mb-4 rounded-lg p-3 ${palette.errorBanner}`}>
          <Text className="text-center text-sm font-semibold">{error}</Text>
        </View>
      ) : null}

      {crops.length === 0 ? (
        <View className="flex-1 items-center justify-center gap-3">
          <Text className={`text-center text-lg font-semibold ${palette.body}`}>
            Aún no tienes cultivos registrados
          </Text>
          <Text className={`text-center text-sm ${palette.sub}`}>
            Crea tu primer cultivo para poder registrar plagas.
          </Text>
          <Button text="Ir a mis cultivos" onPress={() => router.push('/crops')} />
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
          renderItem={({ item }) => (
            <Pressable
              accessibilityLabel={`Plaga ${item.commonName}, severidad ${item.severity}`}
              accessibilityHint="Abre el detalle de la plaga para editarla o eliminarla"
              accessibilityRole="button"
              onPress={() => router.push(`/pests/${item.id}`)}
              className={`mb-3 rounded-2xl p-4 ${palette.card}`}
            >
              <View className="flex-row items-center justify-between">
                <Text className={`text-lg font-bold ${palette.title}`}>{item.commonName}</Text>
                <Badge value={item.severity} />
              </View>
              {item.scientificName ? (
                <Text className={`mt-0.5 text-xs italic ${palette.sub}`}>
                  {item.scientificName}
                </Text>
              ) : null}
              <Text className={`mt-1 text-sm ${palette.sub}`}>
                Cultivo: {item.crop?.species ?? 'No asociado'}
              </Text>
              {item.symptoms.length > 0 ? (
                <Text className={`mt-1 text-xs ${palette.sub}`} numberOfLines={2}>
                  Síntomas: {item.symptoms.join(', ')}
                </Text>
              ) : null}
            </Pressable>
          )}
        />
      )}
    </View>
  );
}