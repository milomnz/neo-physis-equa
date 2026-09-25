import { Pressable, Text, View } from 'react-native';
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from 'react-hook-form';
import { useAccessibility } from '../accessibility/context';

export interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: SelectOption[];
  empty?: string;
  rules?: RegisterOptions<T>;
}

export default function Select<T extends FieldValues>({
  control,
  name,
  label,
  options,
  empty,
  rules,
}: SelectProps<T>) {
  const { highContrast } = useAccessibility();

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className="gap-1.5">
          <Text className={`font-inter-semibold ${highContrast ? 'text-crema' : 'text-noche'}`}>
            {label}
          </Text>
          {options.length === 0 ? (
            <Text className={highContrast ? 'text-crema/80' : 'text-turquesa'}>
              {empty ?? 'Sin opciones disponibles'}
            </Text>
          ) : (
            <View className="flex-row flex-wrap gap-2">
              {options.map((option) => {
                const active = String(option.value) === String(value);
                return (
                  <Pressable
                    key={String(option.value)}
                    onPress={() => onChange(option.value)}
                    accessibilityRole="button"
                    accessibilityState={{ selected: active }}
                    className={`rounded-full border-2 px-4 py-2 active:opacity-70 ${
                      active
                        ? highContrast
                          ? 'border-crema bg-crema'
                          : 'border-turquesa bg-turquesa'
                        : highContrast
                          ? 'border-crema bg-noche'
                          : 'border-turquesa bg-white'
                    }`}
                  >
                    <Text
                      className={`text-xs font-inter-semibold ${
                        active
                          ? highContrast
                            ? 'text-noche'
                            : 'text-crema'
                          : highContrast
                            ? 'text-crema'
                            : 'text-noche'
                      }`}
                    >
                      {option.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          )}
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