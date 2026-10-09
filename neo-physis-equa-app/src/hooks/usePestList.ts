import { useCallback, useState } from 'react';
import { Alert } from 'react-native';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';

import { getPests, type Pest } from '../services/pests';
import { getCrops, type Crop } from '../services/crops';
import { useDebouncedValue } from './useDebouncedValue';
import { useRequireSession } from './useRequireSession';

export function usePestList() {
    const router = useRouter();
    const params = useLocalSearchParams<{ cropId?: string }>();
    const sessionReady = useRequireSession();

    const [pests, setPests] = useState<Pest[]>([]);
    const [crops, setCrops] = useState<Crop[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [selectedCrop, setSelectedCrop] = useState<string | undefined>(
        typeof params.cropId === 'string' && params.cropId ? params.cropId : undefined,
    );
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
                    const [pestsData, cropsData] = await Promise.all([getPests(), getCrops()]);
                    if (cancelled) return;
                    setPests(pestsData);
                    setCrops(cropsData);
                    setError('');
                } catch (err: unknown) {
                    if (cancelled) return;
                    setError(err instanceof Error ? err.message : 'Error al cargar las plagas');
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

    const selectedCropLabel = crops.find((c) => c.id === selectedCrop)?.species;

    const filteredPests = pests.filter((pest) => {
        const matchesCrop = selectedCrop ? pest.cropId === selectedCrop : true;
        const q = debouncedSearch.trim().toLowerCase();
        const matchesSearch =
            !q ||
            pest.commonName.toLowerCase().includes(q) ||
            (pest.scientificName ?? '').toLowerCase().includes(q) ||
            (pest.crop?.species ?? '').toLowerCase().includes(q);
        return matchesCrop && matchesSearch;
    });

    const goToNew = () => {
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

    const goToDetail = (id: string) => router.push(`/pests/${id}`);

    const goToCrops = () => router.push('/crops');

    return {
        pests,
        crops,
        filteredPests,
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
    };
}