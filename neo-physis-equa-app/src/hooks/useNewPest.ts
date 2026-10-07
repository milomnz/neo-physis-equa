import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import { getCrops, type Crop } from '../services/crops';
import { createPest, type Severity } from '../services/pests';
import { useRequireSession } from './useRequireSession';

interface PestForm {
    cropId: string;
    commonName: string;
    scientificName: string;
    symptoms: string;
    severity: Severity;
}

export function useNewPest() {
    const router = useRouter();
    const sessionReady = useRequireSession();
    const [crops, setCrops] = useState<Crop[]>([]);
    const [loading, setLoading] = useState(true);

    const {
        control,
        handleSubmit,
        setError,
        formState: { errors },
    } = useForm<PestForm>({
        defaultValues: { severity: 'media' },
    });

    useEffect(() => {
        if (!sessionReady) return;

        (async () => {
            try {
                const data = await getCrops();
                setCrops(data);
            } catch (err: unknown) {
                setError('root', {
                    type: 'manual',
                    message: err instanceof Error ? err.message : 'Error al cargar los cultivos',
                });
            } finally {
                setLoading(false);
            }
        })();
    }, [sessionReady, setError]);

    const onSubmit = handleSubmit(async (data) => {
        try {
            const pest = await createPest({
                cropId: data.cropId,
                commonName: data.commonName.trim(),
                scientificName: data.scientificName.trim() || null,
                severity: data.severity,
                symptoms: data.symptoms
                    .split(',')
                    .map((s) => s.trim())
                    .filter(Boolean),
            });
            router.replace(`/pests?cropId=${pest.cropId}`);
        } catch (err: unknown) {
            setError('root', {
                type: 'manual',
                message: err instanceof Error ? err.message : 'Error inesperado del servidor',
            });
        }
    });

    const goToCrops = () => router.replace('/crops');

    return {
        control,
        crops,
        loading,
        rootError: errors.root?.message,
        onSubmit,
        goToCrops,
    };
}