import { Text } from 'react-native';
import { useAccessibility } from '../accessibility/context';

interface BadgeColor {
  light: string;
  dark: string;
}

const COLORS: Record<string, BadgeColor> = {
  activo: { light: 'bg-blue-50 text-blue-700', dark: 'bg-blue-950 text-blue-300' },
  inactivo: { light: 'bg-neutral-100 text-neutral-600', dark: 'bg-turquesa text-crema' },
  pendiente: { light: 'bg-amber-50 text-amber-700', dark: 'bg-amber-950 text-amber-300' },
  resuelto: { light: 'bg-green-50 text-green-700', dark: 'bg-green-950 text-green-300' },
  alta: { light: 'bg-red-50 text-red-700', dark: 'bg-red-950 text-red-300' },
  media: { light: 'bg-amber-50 text-amber-700', dark: 'bg-amber-950 text-amber-300' },
  baja: { light: 'bg-neutral-100 text-neutral-600', dark: 'bg-turquesa text-crema' },
};

export default function Badge({ value }: { value: string }) {
  const { highContrast } = useAccessibility();
  const entry = COLORS[value] ?? COLORS.baja;
  const color = highContrast ? entry.dark : entry.light;
  return (
    <Text className={`self-start rounded-full px-2.5 py-1 text-[10px] font-inter-bold ${color}`}>
      {value}
    </Text>
  );
}