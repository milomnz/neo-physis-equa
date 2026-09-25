import { Pressable, Text } from 'react-native';
import { useAccessibility } from '../accessibility/context';

interface ButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
  danger?: boolean;
  className?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export default function Button({
  text,
  onPress,
  disabled,
  secondary,
  danger,
  className = '',
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const { highContrast } = useAccessibility();

  const containerClass = danger
    ? 'border-2 border-red-500'
    : secondary
      ? highContrast
        ? 'border-2 border-crema'
        : 'border-2 border-turquesa'
      : highContrast
        ? 'bg-crema border-2 border-crema'
        : 'bg-turquesa';

  const textClass = danger
    ? highContrast
      ? 'text-red-300'
      : 'text-red-600'
    : secondary
      ? highContrast
        ? 'text-crema'
        : 'text-noche'
      : highContrast
        ? 'text-noche'
        : 'text-crema';

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel ?? text}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      className={`items-center justify-center rounded-xl min-h-[48px] p-4 active:opacity-80 disabled:opacity-50 ${containerClass} ${className}`}
    >
      <Text className={`font-bricolage ${textClass}`}>{text}</Text>
    </Pressable>
  );
}