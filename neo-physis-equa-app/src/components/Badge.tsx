import { Text } from 'react-native';

const COLORS: Record<string, string> = {
  activo: 'bg-blue-50 text-blue-700',
  inactivo: 'bg-neutral-100 text-neutral-600',
  pendiente: 'bg-amber-50 text-amber-700',
  resuelto: 'bg-green-50 text-green-700',
  alta: 'bg-red-50 text-red-700',
  media: 'bg-amber-50 text-amber-700',
  baja: 'bg-neutral-100 text-neutral-600',
};

export default function Badge({ value }: { value: string }) {
  const color = COLORS[value] ?? 'bg-neutral-100 text-neutral-600';
  return (
    <Text className={`self-start rounded-full px-2.5 py-1 text-[10px] font-bold ${color}`}>
      {value}
    </Text>
  );
}