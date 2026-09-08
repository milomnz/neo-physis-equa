import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import './global.css';

export default function App() {
  return (
    <View className="flex-1 items-center justify-center bg-slate-900">
      <View className="w-4/5 items-center rounded-2xl bg-blue-500 p-6 shadow-lg">
        <Text className="text-2xl font-bold text-white">Neo Physis Equa</Text>
        <Text className="mt-2 text-center text-sm text-blue-100">
          Tailwind CSS funcionando con NativeWind
        </Text>
      </View>
      <StatusBar style="light" />
    </View>
  );
}