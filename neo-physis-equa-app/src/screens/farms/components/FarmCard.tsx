import { Text, View } from 'react-native';

import Button from '../../../components/Button';
import { useAccessibility } from '../../../accessibility/context';
import type { Farm } from '../../../services/farms';

interface FarmCardProps {
  farm: Farm;
  onScan: (farm: Farm) => void;
  onOpen: (farm: Farm) => void;
}

export default function FarmCard({ farm, onScan, onOpen }: FarmCardProps) {
  const { palette } = useAccessibility();

  return (
    <View
      accessibilityLabel={`Finca ${farm.name}, altitud ${farm.altitude} metros sobre el nivel del mar`}
      className={`gap-3 rounded-2xl p-4 ${palette.card}`}
    >
      <View className="flex-row items-center justify-between gap-2">
        <Text className={`flex-1 text-lg font-inter-semibold ${palette.title}`}>{farm.name}</Text>
        <Text className={`rounded-full px-2.5 py-1 text-[12px] font-inter-bold ${palette.chipBg}`}>
          {farm.altitude} m s. n. m.
        </Text>
      </View>

      <Text className={`text-sm ${palette.sub}`}>
        {[farm.location?.vereda, farm.location?.municipio]
          .filter(Boolean)
          .join(', ') || 'Ubicación no especificada'}
      </Text>

      <Button
        text="Diagnosticar plagas"
        onPress={() => onScan(farm)}
        accessibilityLabel={`Iniciar escáner de cámara para la finca ${farm.name}`}
        accessibilityHint="Abre el escáner de cámara para analizar plagas en este terreno"
      />
      <Button
        text="Ver y gestionar →"
        onPress={() => onOpen(farm)}
        secondary
        accessibilityLabel={`Ver y gestionar la finca ${farm.name}`}
        accessibilityHint="Abre el detalle de la finca para editarla, eliminarla o ver sus cultivos"
      />
    </View>
  );
}
