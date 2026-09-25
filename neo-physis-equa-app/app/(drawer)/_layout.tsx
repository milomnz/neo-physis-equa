import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname, useNavigation } from 'expo-router';
import { useAccessibility } from '../../src/accessibility/context';;

function CustomDrawerContent() {
  const { highContrast } = useAccessibility();
  const router = useRouter();
  const pathname = usePathname(); // Nos permite saber en qué pantalla estamos
  
  const textColor = highContrast ? '#F3F4F4' : '#011824';
  const borderColor = highContrast ? '#F3F4F4' : '#17536D';
  const activeBg = '#17536D';
  const activeText = '#F3F4F4';

  // Componente reutilizable para los botones del menú
  const NavItem = ({ path, icon, label }: { path: any, icon: any, label: string }) => {
    // Verificamos si la ruta actual coincide con la del botón
    const isActive = pathname === path || pathname.startsWith(`${path}/`);
    
    return (
      <Pressable 
        onPress={() => router.push(path)}
        className={`mb-2 flex-row items-center rounded-xl p-3 ${isActive ? 'bg-turquesa' : 'active:bg-turquesa/10'}`}
        accessibilityRole="button"
        accessibilityState={{ selected: isActive }}
      >
        <Ionicons name={icon} size={24} color={isActive ? activeText : textColor} />
        <Text 
          className="ml-4 text-base" 
          style={{ fontFamily: 'Inter_600SemiBold', color: isActive ? activeText : textColor }}
        >
          {label}
        </Text>
      </Pressable>
    );
  };

  return (
    <View style={{ flex: 1, backgroundColor: highContrast ? '#011824' : '#F3F4F4' }}>
      {/* 1. Cabecera Visual (Con un margen superior para la barra de estado) */}
      <View className="mb-4 mt-12 border-b p-6 pb-4" style={{ borderBottomColor: borderColor + '30' }}>
        <Text 
          className="text-2xl" 
          style={{ fontFamily: 'BricolageGrotesque_700Bold', color: highContrast ? '#F3F4F4' : '#17536D' }}
        >
          AgroPhysis
        </Text>
        <Text className="text-sm opacity-70" style={{ fontFamily: 'Inter_400Regular', color: textColor }}>
          Menú de gestión
        </Text>
      </View>
      
      {/* 2. Items Nativos 100% Controlados */}
      <ScrollView className="flex-1 px-4">
        <NavItem path="/farms" icon="leaf-outline" label="Mis Fincas" />
        <NavItem path="/crops" icon="nutrition-outline" label="Mis Cultivos" />
        <NavItem path="/pests" icon="bug-outline" label="Catálogo de Plagas" />
      </ScrollView>

      {/* 3. Botón inferior para volver al Home */}
      <View className="border-t p-4" style={{ borderTopColor: borderColor + '30' }}>
        <Pressable 
          onPress={() => router.replace('/home')}
          className="flex-row items-center rounded-xl p-3 active:bg-turquesa/10"
        >
          <Ionicons name="home-outline" size={24} color={textColor} />
          <Text className="ml-4 text-base" style={{ fontFamily: 'Inter_600SemiBold', color: textColor }}>
            Volver al inicio
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export default function DrawerLayout() {
  const { highContrast } = useAccessibility();
  
  const bgTheme = highContrast ? '#011824' : '#F3F4F4';
  const headerTheme = highContrast ? '#011824' : '#17536D';

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={() => <CustomDrawerContent />}
        // CAMBIO CLAVE: Convertimos screenOptions en una función que recibe { navigation }
        screenOptions={({ navigation }) => ({
          headerStyle: { backgroundColor: headerTheme },
          headerTintColor: '#F3F4F4',
          headerTitleAlign: 'center',
          headerShadowVisible: false,
          headerTitleStyle: { fontFamily: 'BricolageGrotesque_700Bold', fontSize: 18 },
          sceneContainerStyle: { backgroundColor: bgTheme },
          drawerStyle: { backgroundColor: bgTheme, width: '75%' },
          
          headerLeft: () => (
            <Pressable 
              onPress={() => navigation.toggleDrawer()} // Ahora sí funcionará nativamente
              className="pl-5 active:opacity-70"
              accessibilityLabel="Abrir menú de navegación"
            >
              <Ionicons name="menu" size={28} color="#F3F4F4" />
            </Pressable>
          ),
        })}
      >
        <Drawer.Screen name="farms/index" options={{ title: 'Mis Fincas' }} />
        <Drawer.Screen name="crops/index" options={{ title: 'Mis Cultivos' }} />
        <Drawer.Screen name="pests/index" options={{ title: 'Plagas' }} />
      </Drawer>
    </GestureHandlerRootView>
  );
}