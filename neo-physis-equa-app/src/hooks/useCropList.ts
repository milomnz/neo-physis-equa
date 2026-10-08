import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect, useRouter } from 'expo-router';

import { getCrops, type Crop } from '../services/crops';
import { getFarms, type Farm } from '../services/farms';
import { useDebouncedValue } from './useDebouncedValue';
import { useRequireSession } from './useRequireSession';

export function useCropList(initialFarmId?: string) {
    const router = useRouter();
    const sessionReady = useRequireSession();
    const [crops, setCrops] = useState<Crop[]>([]);
    const [farms, setFarms] = useState<Farm[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedFarm, setSelectedFarm] = useState<string | undefined>(initialFarmId || undefined);
    const [error, setError] = useState('');

    const debouncedSearch = useDebouncedValue(search, 300);

    // Reload on every focus: the list stays mounted while other screens are open.
    useFocusEffect(
        useCallback(() => {
            if (!sessionReady) return;

            // Ignore the response if focus is lost before the request finishes.
            let cancelled = false;

            (async () => {
                try {
                    const [cropsData, farmsData] = await Promise.all([getCrops(), getFarms()]);
                    if (cancelled) return;
                    setCrops(cropsData);
                    setFarms(farmsData);
                    setError('');
                } catch (err: unknown) {
                    if (cancelled) return;
                    setError(err instanceof Error ? err.message : 'Error al cargar los cultivos');
                } finally {
                    // Only the first load shows the spinner; refocus reloads are silent.
                    if (!cancelled) setLoading(false);
                }
            })();

            return () => {
                cancelled = true;
            };
        }, [sessionReady]),
    );

    const selectedFarmName = farms.find((f) => f.id === selectedFarm)?.name;

    const filteredCrops = crops.filter((crop) => {
        const matchesFarm = selectedFarm ? crop.farmId === selectedFarm : true;
        const q = debouncedSearch.toLowerCase();
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
