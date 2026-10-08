import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import { createCrop } from '../services/crops';
import { getFarms, type Farm } from '../services/farms';
import type { NewCropFormValues } from '../screens/crops/validators';
import { useRequireSession } from './useRequireSession';

export function useNewCrop() {
    const router = useRouter();
    const sessionReady = useRequireSession();
    const [farms, setFarms] = useState<Farm[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadError, setLoadError] = useState('');

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors, isSubmitting },
    } = useForm<NewCropFormValues>({
        defaultValues: { growthStage: 'vegetativo' },
    });

    useEffect(() => {
        if (!sessionReady) return;

        // Ignore the response if the screen unmounts before the request finishes.
        let cancelled = false;

        (async () => {
            try {
                const data = await getFarms();
                if (!cancelled) setFarms(data);
            } catch (err: unknown) {
                if (cancelled) return;
                setLoadError(err instanceof Error ? err.message : 'Error al cargar las fincas');
            } finally {
                if (!cancelled) setLoading(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [sessionReady]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const crop = await createCrop({
                farmId: data.farmId,
                species: data.species.trim(),
                growthStage: data.growthStage,
                plantedDate: data.plantedDate.trim() || null,
                notes: data.notes.trim() || null,
            });
            router.replace(`/crops?farmId=${crop.farmId}`);
        } catch (err: unknown) {
            setError('root', {
                type: 'manual',
                message: err instanceof Error ? err.message : 'Error inesperado del servidor',
            });
        }
    });

    const goToFarms = () => router.replace('/farms');

    return {
        control,
        farms,
        loading,
        loadError,
        submitting: isSubmitting,
        rootError: errors.root?.message,
        onSubmit,
        goToFarms,
    };
}
