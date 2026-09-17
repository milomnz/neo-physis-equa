import { TextInput } from 'react-native';
import { useAccessibility } from '../accessibility/context';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

export default function SearchBar({ value, onChangeText, placeholder }: SearchBarProps) {
  const { highContrast } = useAccessibility();

  return (
    <TextInput
      accessibilityLabel="Buscar"
      accessibilityHint={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={highContrast ? '#fbbf24' : '#a3a3a3'}
      className={`mb-4 rounded-xl border p-3.5 ${
        highContrast ? 'border-amber-400 bg-black text-amber-400' : 'border-neutral-300 bg-white'
      }`}
    />
  );
}