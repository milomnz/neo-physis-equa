import { Stack, useRouter } from 'expo-router';
import { ActivityIndicator, Pressable, View } from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import { BricolageGrotesque_700Bold } from '@expo-google-fonts/bricolage-grotesque';
import { AccessibilityProvider, useAccessibility } from '../src/accessibility/context';
import '../global.css';
import { Ionicons } from '@expo/vector-icons';

function RootStack() {
  const { highContrast } = useAccessibility();
  const router = useRouter();
  const bgColor = highContrast ? '#011824' : '#17536D';

  const renderBackButton = () => (
    <Pressable 
      onPress={() => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace('/home'); // Fallback si se recarga la página web de golpe
        }
      }} 
      className="pr-5 active:opacity-70"
      accessibilityLabel="Volver a la pantalla anterior"
    >
      <Ionicons name="arrow-back" size={26} color="#F3F4F4" />
    </Pressable>
  );  

  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: bgColor },
        headerTintColor: '#F3F4F4',
        headerTitleAlign: 'center',
        headerShadowVisible: false,
        headerTitleStyle: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 18 },
        contentStyle: { backgroundColor: highContrast ? '#011824' : '#F3F4F4' }
      }}
    >
      {/* 1. Flujo sin Header */}
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ headerShown: false }} />
      <Stack.Screen name="register" options={{ title: 'Crear cuenta' }} />

      {/* 2. El Grupo Drawer (Ocultamos el header del Stack para que el Drawer muestre el suyo) */}
      <Stack.Screen name="(drawer)" options={{ headerShown: false }} />

      {/* 3. Pantallas de Detalle (Stack nativo con flecha de volver automática) */}
      <Stack.Screen name="farms/[id]" options={{ title: 'Detalle de la Finca' }} />
      <Stack.Screen name="crops/new" options={{ title: 'Nuevo Cultivo' }} />
      <Stack.Screen name="crops/[id]" options={{ title: 'Detalle del Cultivo' }} />
      <Stack.Screen name="pests/new" options={{ title: 'Nueva Plaga' }} />
      <Stack.Screen name="pests/[id]" options={{ title: 'Detalle de la Plaga' }} />
      <Stack.Screen name="profile" options={{ title: 'Mi perfil' }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular, Inter_600SemiBold, Inter_700Bold, BricolageGrotesque_700Bold,
  });

  if (!fontsLoaded) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F3F4F4]">
        <ActivityIndicator size="large" color="#17536D" />
      </View>
    );
  }

  return (
    <AccessibilityProvider>
      <RootStack />
    </AccessibilityProvider>
  );
}