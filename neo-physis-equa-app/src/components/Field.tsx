import { useState } from 'react';
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
  const [focused, setFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
        <View className="gap-1.5">
          <Text
            className={`font-inter-semibold ${highContrast ? 'text-crema' : 'text-noche'}`}
          >
            {label}
          </Text>
          <TextInput
            className={`rounded-xl border-2 p-3.5 ${
              error
                ? 'border-red-500'
                : focused
                  ? 'border-noche'
                  : highContrast
                    ? 'border-crema bg-noche text-crema'
                    : 'border-turquesa/50 bg-white text-noche'
            }`}
            placeholderTextColor={highContrast ? '#F3F4F480' : '#6B979A'}
            value={value ?? ''}
            {...inputProps}
            onChangeText={onChange}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              onBlur();
            }}
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