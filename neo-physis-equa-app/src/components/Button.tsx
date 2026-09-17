import { Pressable, Text } from 'react-native';

interface ButtonProps {
  text: string;
  onPress: () => void;
  disabled?: boolean;
  secondary?: boolean;
  className?: string;
}

export default function Button({
  text,
  onPress,
  disabled,
  secondary,
  className = '',
}: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      className={`items-center rounded-xl p-4 active:opacity-80 disabled:opacity-50 ${
        secondary ? 'border border-neutral-300' : 'bg-blue-600'
      } ${className}`}
    >
      <Text className={`font-semibold ${secondary ? 'text-neutral-700' : 'text-white'}`}>
        {text}
      </Text>
    </Pressable>
  );
}