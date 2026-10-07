import { Pressable, Text, View } from 'react-native';

const DISABILITY_OPTIONS = [
  { value: 'ninguna', label: 'Ninguna' },
  { value: 'motora', label: 'Motora' },
  { value: 'visual', label: 'Visual' },
  { value: 'auditiva', label: 'Auditiva' },
  { value: 'intelectual', label: 'Intelectual' },
];

interface DisabilitySelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export default function DisabilitySelector({ value, onChange }: DisabilitySelectorProps) {
  return (
    <View className="mb-6">
      <Text className="mb-1 text-sm font-inter-semibold text-noche">
        Tipo de discapacidad (opcional)
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {DISABILITY_OPTIONS.map((opt) => {
          const active = value === opt.value;
          return (
            <Pressable
              key={opt.value}
              onPress={() => onChange(opt.value)}
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              className={`rounded-full border-2 px-4 py-2 ${
                active ? 'border-turquesa bg-turquesa' : 'border-turquesa bg-white'
              }`}
            >
              <Text
                className={`text-xs font-inter-semibold ${
                  active ? 'text-crema' : 'text-noche'
                }`}
              >
                {opt.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}