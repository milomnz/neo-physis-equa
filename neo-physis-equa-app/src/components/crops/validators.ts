import type { RegisterOptions } from 'react-hook-form';
import type { GrowthStage } from '../../services/crops';

export interface CropFormValues {
  species: string;
  plantedDate: string;
  growthStage: GrowthStage;
  notes: string;
}

export interface NewCropFormValues extends CropFormValues {
  farmId: string;
}

export const CROP_FIELD_RULES: Record<
  'species' | 'plantedDate' | 'notes',
  RegisterOptions<CropFormValues>
> = {
  species: {
    required: 'La especie es obligatoria',
    maxLength: { value: 100, message: 'La especie debe tener máximo 100 caracteres' },
  },
  plantedDate: {
    pattern: { value: /^\d{4}-\d{2}-\d{2}$/, message: 'Formato esperado: AAAA-MM-DD' },
  },
  notes: {
    maxLength: { value: 500, message: 'Las notas deben tener máximo 500 caracteres' },
  },
};

export const FARM_FIELD_RULES: RegisterOptions<NewCropFormValues> = {
  required: 'Selecciona la finca del cultivo',
};
