import { Pressable, Text, View } from 'react-native';
import { useAccessibility } from '../accessibility/context';

export interface ChipFilterOption {
  value: string;
  label: string;
}

interface ChipFilterProps {
  label: string;
  options: ChipFilterOption[];
  selected?: string;
  onSelect: (value: string | undefined) => void;
  empty?: string;
}

export default function ChipFilter({
  label,
  options,
  selected,
  onSelect,
  empty = 'Sin opciones disponibles',
}: ChipFilterProps) {
  const { highContrast } = useAccessibility();

  return (
    <View className="mb-4 gap-1.5">
      <Text className={`font-inter-semibold ${highContrast ? 'text-crema' : 'text-noche'}`}>
        {label}
      </Text>
      {options.length === 0 ? (
        <Text className={highContrast ? 'text-crema/80' : 'text-turquesa'}>{empty}</Text>
      ) : (
        <View className="flex-row flex-wrap gap-2">
          {options.map((option) => {
            const active = String(option.value) === String(selected);
            return (
              <Pressable
                key={String(option.value)}
                onPress={() => onSelect(active ? undefined : String(option.value))}
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
    </View>
  );
}