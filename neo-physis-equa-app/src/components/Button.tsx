import { Pressable, Text } from 'react-native';
import { useAccessibility } from '../accessibility/context';

interface ButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
  className?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export default function Button({
  text,
  onPress,
  disabled,
  secondary,
  className = '',
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const { highContrast } = useAccessibility();

  const containerClass = secondary
    ? highContrast
      ? 'border border-amber-400'
      : 'border border-neutral-300'
    : highContrast
      ? 'bg-amber-400'
      : 'bg-blue-600';

  const textClass = secondary
    ? highContrast
      ? 'text-amber-400'
      : 'text-neutral-700'
    : highContrast
      ? 'text-black'
      : 'text-white';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel ?? text}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      className={`items-center rounded-xl p-4 active:opacity-80 disabled:opacity-50 ${containerClass} ${className}`}
    >
      <Text className={`font-semibold ${textClass}`}>{text}</Text>
    </Pressable>
  );
}