import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

import { deleteFarm, getFarm, updateFarm, type Farm } from '../services/farms';
import { useFarmForm } from './useFarmForm';
import { useRequireSession } from './useRequireSession';

export function useFarmDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const sessionReady = useRequireSession();

    const [farm, setFarm] = useState<Farm | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [screenError, setScreenError] = useState('');
    const [saved, setSaved] = useState(false);

    const { control, handleSubmit, reset, errors } = useFarmForm();

    useEffect(() => {
        if (!sessionReady || !id) return;

        (async () => {
            try {
                const data = await getFarm(id);
                setFarm(data);
                reset({
                    name: data.name,
                    vereda: data.location?.vereda ?? '',
                    municipio: data.location?.municipio ?? '',
                    altitude: String(data.altitude ?? ''),
                });
            } catch (err: unknown) {
                setScreenError(err instanceof Error ? err.message : 'Error al cargar la finca');
            } finally {
                setLoading(false);
            }
        })();
    }, [id, sessionReady, reset]);

    const onSubmit = handleSubmit(async (data) => {
        if (!farm) return;
        setSaving(true);
        setSaved(false);
        setScreenError('');

        try {
            const patch: Record<string, unknown> = {};
            const name = data.name.trim();
            const parsedAltitude = parseFloat(data.altitude);
            if (name !== farm.name) patch.name = name;

            const newLocation: Record<string, string> = {};
            if (data.vereda.trim() !== (farm.location?.vereda ?? '')) newLocation.vereda = data.vereda.trim();
            if (data.municipio.trim() !== (farm.location?.municipio ?? '')) newLocation.municipio = data.municipio.trim();
            if (Object.keys(newLocation).length > 0) patch.location = { ...(farm.location ?? {}), ...newLocation };

            if (parsedAltitude !== farm.altitude) patch.altitude = parsedAltitude;

            if (Object.keys(patch).length === 0) {
                reset({
                    name,
                    vereda: data.vereda.trim(),
                    municipio: data.municipio.trim(),
                    altitude: data.altitude,
                });
                setSaved(true);
                return;
            }

            const updated = await updateFarm(farm.id, patch);
            setFarm(updated);
            reset({
                name: updated.name,
                vereda: updated.location?.vereda ?? '',
                municipio: updated.location?.municipio ?? '',
                altitude: String(updated.altitude ?? ''),
            });
            setSaved(true);
        } catch (err: unknown) {
            setScreenError(err instanceof Error ? err.message : 'Error al guardar los cambios');
        } finally {
            setSaving(false);
        }
    });

    const handleDelete = () => {
        if (!farm) return;
        Alert.alert(
            'Eliminar finca',
            `¿Seguro que deseas eliminar la finca "${farm.name}"? Esta acción eliminará también sus cultivos y plagas asociadas.`,
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Eliminar',
                    style: 'destructive',
                    onPress: async () => {
                        try {
                            await deleteFarm(farm.id);
                            router.replace('/farms');
                        } catch (err: unknown) {
                            Alert.alert('Error', err instanceof Error ? err.message : 'Error al eliminar la finca');
                        }
                    },
                },
            ],
        );
    };

    const goToCrops = () => {
        if (!farm) return;
        router.push(`/crops?farmId=${farm.id}`);
    };

    return {
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
        goToFarms: () => router.replace('/farms'),
    };
}
