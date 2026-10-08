import { useCallback, useState } from 'react';
import { useFocusEffect, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';

import { createFarm, getFarms, type Farm } from '../services/farms';
import { useDebouncedValue } from './useDebouncedValue';
import { useRequireSession } from './useRequireSession';

export interface FarmForm {
    name: string;
    vereda: string;
    municipio: string;
    altitude: string;
}

export function useFarmList() {
    const router = useRouter();
    const sessionReady = useRequireSession();

    const [farms, setFarms] = useState<Farm[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [search, setSearch] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const debouncedSearch = useDebouncedValue(search, 300);

    const { control, handleSubmit, reset, setError, formState: { errors } } = useForm<FarmForm>();

    const fetchFarms = useCallback(async () => {
        try {
            const data = await getFarms();
            setFarms(data);
        } catch (err: unknown) {
            setError('root', {
                type: 'manual',
                message: err instanceof Error ? err.message : 'Error al cargar las fincas',
            });
        }
    }, [setError]);

    // Reload on every focus: the list stays mounted while other screens are open.
    useFocusEffect(
        useCallback(() => {
            if (!sessionReady) return;

            // Ignore the response if focus is lost before the request finishes.
            let cancelled = false;

            (async () => {
                try {
                    const data = await getFarms();
                    if (cancelled) return;
                    setFarms(data);
                } catch (err: unknown) {
                    if (cancelled) return;
                    setError('root', {
                        type: 'manual',
                        message: err instanceof Error ? err.message : 'Error al cargar las fincas',
                    });
                } finally {
                    // Only the first load shows the spinner; refocus reloads are silent.
                    if (!cancelled) setLoading(false);
                }
            })();

            return () => {
                cancelled = true;
            };
        }, [sessionReady, setError]),
    );

    const onSubmit = async (data: FarmForm) => {
        setSubmitting(true);
        setSuccess('');
        try {
            await createFarm({
                name: data.name.trim(),
                location: {
                    vereda: data.vereda.trim() || undefined,
                    municipio: data.municipio.trim() || undefined,
                },
                altitude: parseFloat(data.altitude),
            });
            reset({ name: '', vereda: '', municipio: '', altitude: '' });
            setShowForm(false);
            setSuccess('Finca registrada correctamente.');
            await fetchFarms();
        } catch (err: unknown) {
            setError('root', {
                type: 'manual',
                message: err instanceof Error ? err.message : 'Error al registrar la finca',
            });
        } finally {
            setSubmitting(false);
        }
    };

    const q = debouncedSearch.trim().toLowerCase();
    const filteredFarms = q
        ? farms.filter((farm) => {
            const location = [farm.location?.vereda, farm.location?.municipio, farm.location?.departamento]
                .filter(Boolean)
                .join(' ')
                .toLowerCase();
            return farm.name.toLowerCase().includes(q) || location.includes(q);
        })
        : farms;

    const goToDetail = (id: string) => router.push(`/farms/${id}`);

    return {
        farms,
        filteredFarms,
        loading,
        showForm,
        setShowForm,
        search,
        setSearch,
        success,
        submitting,
        control,
        errors,
        handleSubmit,
        onSubmit,
        goToDetail,
    };
}
