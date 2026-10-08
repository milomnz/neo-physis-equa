import { type Control } from 'react-hook-form';

import Field from '../../../components/Field';
import { farmFormRules, type FarmForm } from '../../../hooks/useFarmForm';

interface FarmFormFieldsProps {
  control: Control<FarmForm>;
  withPlaceholders?: boolean;
}

export default function FarmFormFields({ control, withPlaceholders }: FarmFormFieldsProps) {
  return (
    <>
      <Field
        control={control}
        name="name"
        label="Nombre de la finca *"
        autoCapitalize="words"
        placeholder={withPlaceholders ? 'ej. Finca El Paraíso' : undefined}
        rules={farmFormRules.name}
      />
      <Field
        control={control}
        name="vereda"
        label="Vereda"
        autoCapitalize="words"
        placeholder={withPlaceholders ? 'ej. La Esmeralda' : undefined}
        rules={farmFormRules.vereda}
      />
      <Field
        control={control}
        name="municipio"
        label="Municipio"
        autoCapitalize="words"
        placeholder={withPlaceholders ? 'ej. Armero' : undefined}
        rules={farmFormRules.municipio}
      />
      <Field
        control={control}
        name="altitude"
        label="Altitud (m.s.n.m.) *"
        keyboardType="numeric"
        placeholder={withPlaceholders ? 'ej. 1650' : undefined}
        rules={farmFormRules.altitude}
      />
    </>
  );
}
