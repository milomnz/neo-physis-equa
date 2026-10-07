import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import { deletePest, getPest, updatePest, type Severity } from '../services/pests';
import { useRequireSession } from './useRequireSession';

interface PestForm {
    commonName: string;
    scientificName: string;
    symptoms: string;
    severity: Severity;
}

export function usePestDetail() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const router = useRouter();
    const sessionReady = useRequireSession();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [screenError, setScreenError] = useState('');
    const [saved, setSaved] = useState(false);

    const { control, handleSubmit, reset } = useForm<PestForm>();

    useEffect(() => {
        if (!sessionReady || !id) return;

        (async () => {
            try {
                const pest = await getPest(id);
                reset({
                    commonName: pest.commonName,
                    scientificName: pest.scientificName ?? '',
                    symptoms: pest.symptoms.join(', '),
                    severity: pest.severity,
                });
            } catch (err: unknown) {
                setScreenError(err instanceof Error ? err.message : 'Error al cargar la plaga');
            } finally {
                setLoading(false);
            }
        })();
    }, [id, sessionReady, reset]);

    const onSubmit = handleSubmit(async (data) => {
        if (!id) return;
        setSaving(true);
        setSaved(false);
        setScreenError('');

        try {
            const current = await getPest(id);
            const patch: Record<string, unknown> = {};
            const commonName = data.commonName.trim();
            const scientificName = data.scientificName.trim() || null;
            const symptoms = data.symptoms
                .split(',')
                .map((s) => s.trim())
                .filter(Boolean);
            if (commonName !== current.commonName) patch.commonName = commonName;
            if (scientificName !== current.scientificName) patch.scientificName = scientificName;
            if (data.severity !== current.severity) patch.severity = data.severity;
            if (symptoms.join('|') !== current.symptoms.join('|')) patch.symptoms = symptoms;

            if (Object.keys(patch).length > 0) {
                await updatePest(id, patch);
            }
            setSaved(true);
        } catch (err: unknown) {
            setScreenError(err instanceof Error ? err.message : 'Error al guardar los cambios');
        } finally {
            setSaving(false);
        }
    });

    const handleDelete = () => {
        if (!id) return;
        Alert.alert('Eliminar plaga', '¿Seguro que deseas eliminar este registro de plaga?', [
            { text: 'Cancelar', style: 'cancel' },
            {
                text: 'Eliminar',
                style: 'destructive',
                onPress: async () => {
                    try {
                        await deletePest(id);
                        router.back();
                    } catch (err: unknown) {
                        Alert.alert(
                            'Error',
                            err instanceof Error ? err.message : 'Error al eliminar la plaga',
                        );
                    }
                },
            },
        ]);
    };

    return { control, loading, saving, saved, screenError, onSubmit, handleDelete };
}