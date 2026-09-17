import { Pressable, Text, View } from 'react-native';

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
  return (
    <View className="mb-4 gap-1.5">
      <Text className="font-semibold text-neutral-700">{label}</Text>
      {options.length === 0 ? (
        <Text className="text-neutral-500">{empty}</Text>
      ) : (
        <View className="flex-row flex-wrap gap-2">
          {options.map((option) => {
            const active = String(option.value) === String(selected);
            return (
              <Pressable
                key={String(option.value)}
                onPress={() => onSelect(active ? undefined : String(option.value))}
                className={`rounded-full border px-4 py-2 active:opacity-70 ${
                  active ? 'border-blue-600 bg-blue-600' : 'border-neutral-300 bg-white'
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    active ? 'text-white' : 'text-neutral-600'
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