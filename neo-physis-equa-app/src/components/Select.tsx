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
          <Text className={`font-semibold ${highContrast ? 'text-amber-400' : 'text-neutral-700'}`}>
            {label}
          </Text>
          {options.length === 0 ? (
            <Text className={highContrast ? 'text-zinc-300' : 'text-neutral-500'}>
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
                    className={`rounded-full border px-4 py-2 active:opacity-70 ${
                      active
                        ? highContrast
                          ? 'border-amber-400 bg-amber-400'
                          : 'border-blue-600 bg-blue-600'
                        : highContrast
                          ? 'border-amber-400 bg-black'
                          : 'border-neutral-300 bg-white'
                    }`}
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        active
                          ? highContrast
                            ? 'text-black'
                            : 'text-white'
                          : highContrast
                            ? 'text-amber-400'
                            : 'text-neutral-600'
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