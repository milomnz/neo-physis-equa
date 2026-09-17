import { Pressable, Text } from 'react-native';

interface ButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
  variant?: 'amber' | 'amberOutline';
  className?: string;
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export default function Button({
  text,
  onPress,
  disabled,
  secondary,
  variant,
  className = '',
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  const solid = variant === 'amber';
  const outline = variant === 'amberOutline';
  const isSecondary = !solid && !outline && secondary;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityLabel={accessibilityLabel ?? text}
      accessibilityHint={accessibilityHint}
      accessibilityRole="button"
      className={`items-center rounded-xl p-4 active:opacity-80 disabled:opacity-50 ${
        solid ? 'bg-amber-400' : outline ? 'border-2 border-amber-400' : isSecondary ? 'border border-neutral-300' : 'bg-blue-600'
      } ${className}`}
    >
      <Text
        className={`font-semibold ${
          solid ? 'text-black' : outline ? 'text-amber-500' : isSecondary ? 'text-neutral-700' : 'text-white'
        }`}
      >
        {text}
      </Text>
    </Pressable>
  );
}