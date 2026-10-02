import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { createCrop } from '../../services/crops';
import { getFarms, type Farm } from '../../services/farms';
import { getSession } from '../../services/session';
import type { NewCropFormValues } from './validators';

export function useNewCrop() {
  const router = useRouter();
  const [farms, setFarms] = useState<Farm[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const session = await getSession();
        if (!session?.token) {
          router.replace('/login');
          return;
        }
        setFarms(await getFarms());
      } catch (err: unknown) {
        setLoadError(err instanceof Error ? err.message : 'Error al cargar las fincas');
      } finally {
        setLoading(false);
      }
    })();
  }, [router]);

  /** Devuelve null si el cultivo se creó; en caso contrario, el mensaje de error. */
  const submit = async (data: NewCropFormValues): Promise<string | null> => {
    try {
      const crop = await createCrop({
        farmId: data.farmId,
        species: data.species.trim(),
        growthStage: data.growthStage,
        plantedDate: data.plantedDate.trim() || null,
        notes: data.notes.trim() || null,
      });
      router.replace(`/crops?farmId=${crop.farmId}`);
      return null;
    } catch (err: unknown) {
      return err instanceof Error ? err.message : 'Error inesperado del servidor';
    }
  };

  return { farms, loading, loadError, submit };
}
