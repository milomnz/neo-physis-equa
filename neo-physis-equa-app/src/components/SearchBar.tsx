import { TextInput } from 'react-native';

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder: string;
}

export default function SearchBar({ value, onChangeText, placeholder }: SearchBarProps) {
  return (
    <TextInput
      accessibilityLabel="Buscar"
      accessibilityHint={placeholder}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#a3a3a3"
      className="mb-4 rounded-xl border border-neutral-300 bg-white p-3.5"
    />
  );
}