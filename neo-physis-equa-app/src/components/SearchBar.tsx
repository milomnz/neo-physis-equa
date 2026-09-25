import { useState } from 'react';
import { TextInput } from 'react-native';
import { useAccessibility } from '../accessibility/context';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

export default function SearchBar({ value, onChangeText, placeholder }: SearchBarProps) {
  const { highContrast } = useAccessibility();
  const [focused, setFocused] = useState(false);

  return (
    <TextInput
      accessibilityLabel="Buscar"
      accessibilityHint={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor={highContrast ? '#F3F4F480' : '#6B979A'}
      className={`mb-4 rounded-xl border-2 p-3.5 ${
        focused
          ? 'border-noche'
          : highContrast
            ? 'border-crema bg-noche text-crema'
            : 'border-turquesa/50 bg-white text-noche'
      }`}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
}