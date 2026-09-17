import { Text, TextInput, type TextInputProps, View } from 'react-native';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';
import { useAccessibility } from '../accessibility/context';

interface FieldProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  label: string;
  rules?: RegisterOptions<T>;
}

export default function Field<T extends FieldValues>({
  control,
  name,
  label,
  rules,
  ...inputProps
}: FieldProps<T>) {
  const { highContrast } = useAccessibility();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View className="gap-1.5">
          <Text className={`font-semibold ${highContrast ? 'text-amber-400' : 'text-neutral-700'}`}>
            {label}
          </Text>
          <TextInput
            className={`rounded-xl border p-3.5 ${
              error
                ? 'border-red-500'
                : highContrast
                  ? 'border-amber-400 bg-black text-amber-400'
                  : 'border-neutral-300 bg-white'
            }`}
            placeholderTextColor={highContrast ? '#fbbf24' : '#a3a3a3'}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            {...inputProps}
          />
          {error?.message && (
            <Text className={`text-xs ${highContrast ? 'text-red-400' : 'text-red-600'}`}>
              {error.message}
            </Text>
          )}
        </View>
      )}
    />
  );
}