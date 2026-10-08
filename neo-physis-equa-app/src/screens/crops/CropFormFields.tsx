import type { Control } from 'react-hook-form';
import Field from '../../components/Field';
import Select from '../../components/Select';
import { GROWTH_STAGES } from '../../services/crops';
import { CROP_FIELD_RULES, type CropFormValues } from './validators';

interface CropFormFieldsProps {
  control: Control<CropFormValues>;
  optionalHints?: boolean;
}

export default function CropFormFields({ control, optionalHints = false }: CropFormFieldsProps) {
  return (
    <>
      <Field
        control={control}
        name="species"
        label="Especie *"
        autoCapitalize="words"
        placeholder={optionalHints ? 'ej. Tomate, Café, Arroz' : undefined}
        rules={CROP_FIELD_RULES.species}
      />

      <Select
        control={control}
        name="growthStage"
        label="Etapa de crecimiento"
        options={GROWTH_STAGES.map((stage) => ({ value: stage, label: stage }))}
      />

      <Field
        control={control}
        name="plantedDate"
        label="Fecha de siembra"
        placeholder={optionalHints ? 'AAAA-MM-DD (opcional)' : 'AAAA-MM-DD'}
        rules={CROP_FIELD_RULES.plantedDate}
      />

      <Field
        control={control}
        name="notes"
        label="Notas"
        placeholder={optionalHints ? 'Observaciones del cultivo (opcional)' : undefined}
        multiline
        numberOfLines={3}
        rules={CROP_FIELD_RULES.notes}
      />
    </>
  );
}
