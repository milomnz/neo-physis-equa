import { Pressable, Text, View } from 'react-native';

import Badge from '../../../components/Badge';
import { useAccessibility } from '../../../accessibility/context';
import type { Pest } from '../../../services/pests';

interface PestCardProps {
  pest: Pest;
  onPress: (pest: Pest) => void;
}

export default function PestCard({ pest, onPress }: PestCardProps) {
  const { palette } = useAccessibility();

  return (
    <Pressable
      accessibilityLabel={`Plaga ${pest.commonName}, severidad ${pest.severity}`}
      accessibilityHint="Abre el detalle de la plaga para editarla o eliminarla"
      accessibilityRole="button"
      onPress={() => onPress(pest)}
      className={`mb-3 rounded-2xl p-4 ${palette.card}`}
    >
      <View className="flex-row items-center justify-between">
        <Text className={`text-lg font-inter-semibold ${palette.title}`}>{pest.commonName}</Text>
        <Badge value={pest.severity} />
      </View>
      {pest.scientificName ? (
        <Text className={`mt-0.5 text-xs italic ${palette.sub}`}>{pest.scientificName}</Text>
      ) : null}
      <Text className={`mt-1 text-sm ${palette.sub}`}>
        Cultivo: {pest.crop?.species ?? 'No asociado'}
      </Text>
      {pest.symptoms.length > 0 ? (
        <Text className={`mt-1 text-xs ${palette.sub}`} numberOfLines={2}>
          Síntomas: {pest.symptoms.join(', ')}
        </Text>
      ) : null}
    </Pressable>
  );
}