import { Stack } from 'expo-router';
import '../global.css';

export default function RootLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: '#ffffff' },
        headerTintColor: '#171717',
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        contentStyle: { backgroundColor: '#f8fafc' }
      }}
    >
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ title: 'Iniciar sesión' }} />
      <Stack.Screen name="register" options={{ title: 'Crear cuenta' }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="farms/index" options={{ title: 'Mis Fincas' }} />
      <Stack.Screen name="farms/[id]" options={{ title: 'Detalle de la Finca' }} />
      <Stack.Screen name="crops/index" options={{ title: 'Mis Cultivos' }} />
      <Stack.Screen name="crops/new" options={{ title: 'Nuevo Cultivo' }} />
      <Stack.Screen name="crops/[id]" options={{ title: 'Detalle del Cultivo' }} />
      <Stack.Screen name="pests/index" options={{ title: 'Plagas' }} />
      <Stack.Screen name="pests/new" options={{ title: 'Nueva Plaga' }} />
      <Stack.Screen name="pests/[id]" options={{ title: 'Detalle de la Plaga' }} />
    </Stack>
  );
}