import { Text, TextInput, type TextInputProps, View } from 'react-native';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';

interface FieldProps<T extends FieldValues> extends TextInputProps {
  control: Control<T>;
  name: Path<T>;
  label: string;
  rules?: RegisterOptions<T>;
  labelClassName?: string;
}

export default function Field<T extends FieldValues>({
  control,
  name,
  label,
  rules,
  labelClassName,
  ...inputProps
}: FieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View className="gap-1.5">
          <Text className={`font-semibold text-neutral-700 ${labelClassName}`}>{label}</Text>
          <TextInput
            className={`rounded-xl border bg-white p-3.5 ${
              error ? 'border-red-500' : 'border-neutral-300'
            }`}
            placeholderTextColor="#a3a3a3"
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            {...inputProps}
          />
          {error?.message && <Text className="text-xs text-red-600">{error.message}</Text>}
        </View>
      )}
    />
  );
}