import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { getCrops, type Crop } from '../../services/crops';
import { getFarms, type Farm } from '../../services/farms';
import { getSession } from '../../services/session';

export function useCropList(initialFarmId?: string) {
  const router = useRouter();
  const [crops, setCrops] = useState<Crop[]>([]);
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedFarm, setSelectedFarm] = useState<string | undefined>(initialFarmId || undefined);
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

  const goToNew = () => {
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

  return {
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
  };
}
