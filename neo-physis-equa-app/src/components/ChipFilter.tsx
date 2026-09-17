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
      <Text className={`font-semibold ${highContrast ? 'text-amber-400' : 'text-neutral-700'}`}>
        {label}
      </Text>
      {options.length === 0 ? (
        <Text className={highContrast ? 'text-zinc-300' : 'text-neutral-500'}>{empty}</Text>
      ) : (
        <View className="flex-row flex-wrap gap-2">
          {options.map((option) => {
            const active = String(option.value) === String(selected);
            return (
              <Pressable
                key={String(option.value)}
                onPress={() => onSelect(active ? undefined : String(option.value))}
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
    </View>
  );
}