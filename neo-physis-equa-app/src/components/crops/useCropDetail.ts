import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import type { UseFormReset } from 'react-hook-form';
import { deleteCrop, getCrop, updateCrop, type UpdateCropData } from '../../services/crops';
import { getSession } from '../../services/session';
import type { CropFormValues } from './validators';

export function useCropDetail(id: string | undefined, reset: UseFormReset<CropFormValues>) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      try {
        const session = await getSession();
        if (!session?.token) {
          router.replace('/login');
          return;
        }
        const crop = await getCrop(id);
        reset({
          species: crop.species,
          plantedDate: crop.plantedDate ? crop.plantedDate.slice(0, 10) : '',
          growthStage: crop.growthStage,
          notes: crop.notes ?? '',
        });
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : 'Error al cargar el cultivo');
      } finally {
        setLoading(false);
      }
    })();
  }, [id, router, reset]);

  const save = async (data: CropFormValues) => {
    if (!id) return;
    setSaving(true);
    setSaved(false);
    setError('');
    try {
      const current = await getCrop(id);
      const patch: UpdateCropData = {};
      const species = data.species.trim();
      const plantedDate = data.plantedDate.trim() || null;
      const notes = data.notes.trim() || null;
      const currentDate = current.plantedDate ? current.plantedDate.slice(0, 10) : null;
      if (species !== current.species) patch.species = species;
      if (data.growthStage !== current.growthStage) patch.growthStage = data.growthStage;
      if (plantedDate !== currentDate) patch.plantedDate = plantedDate;
      if (notes !== current.notes) patch.notes = notes;

      if (Object.keys(patch).length > 0) {
        await updateCrop(id, patch);
      }
      setSaved(true);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const confirmDelete = () => {
    if (!id) return;
    Alert.alert(
      'Eliminar cultivo',
      '¿Seguro que deseas eliminar este cultivo? También se eliminarán las plagas asociadas.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteCrop(id);
              router.back();
            } catch (err: unknown) {
              Alert.alert('Error', err instanceof Error ? err.message : 'Error al eliminar el cultivo');
            }
          },
        },
      ],
    );
  };

  return { loading, saving, saved, error, save, confirmDelete };
}
