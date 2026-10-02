import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import Button from '../Button';
import { type RegisterData } from '../../services/auth';
import { useRegister } from './useRegister';
import { validateRegisterForm, type RegisterFieldErrors } from './validators';

const DISABILITY_OPTIONS = [
  { value: 'ninguna', label: 'Ninguna' },
  { value: 'motora', label: 'Motora' },
  { value: 'visual', label: 'Visual' },
  { value: 'auditiva', label: 'Auditiva' },
  { value: 'intelectual', label: 'Intelectual' },
];

type FieldName = 'nombre' | 'email' | 'password';

export default function RegisterScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<RegisterFieldErrors>({});
  const [disability, setDisability] = useState('ninguna');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [focusedField, setFocusedField] = useState<FieldName | null>(null);
  const { loading, error, register } = useRegister();

  const handleRegister = async () => {
    const next = validateRegisterForm({ nombre, email, password });
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});

    const payload: RegisterData = {
      name: nombre.trim(),
      email: email.trim(),
      password,
      disabilityType: disability === 'ninguna' ? null : disability,
      accessibilityProfile: { ttsEnabled, highContrast },
    };

    if (await register(payload)) {
      setNombre('');
      setEmail('');
      setPassword('');
      router.replace('/login');
    }
  };

  const inputClass = (field: FieldName, hasError?: string) =>
    `rounded-xl border-2 bg-white px-4 py-3 text-base text-noche ${
      hasError ? 'border-red-500' : focusedField === field ? 'border-noche' : 'border-turquesa/50'
    }`;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-crema"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-10"
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center">
          <View className="mb-2 h-16 w-16 items-center justify-center rounded-2xl bg-turquesa">
            <Text className="text-2xl font-bricolage text-crema">N</Text>
          </View>
          <Text className="mb-1 text-3xl font-bricolage text-noche">Neo Physis Equa</Text>
          <Text className="mb-8 text-center text-sm text-turquesa">
            Crea tu cuenta para comenzar
          </Text>
        </View>

        {error && (
          <View className="mb-4 rounded-xl border-2 border-red-500 bg-red-50 p-3">
            <Text className="text-center text-sm text-red-600">{error}</Text>
          </View>
        )}

        <View className="mb-4">
          <Text className="mb-1 text-sm font-inter-semibold text-noche">Nombre</Text>
          <TextInput
            className={inputClass('nombre', errors.nombre)}
            placeholder="Tu nombre completo"
            placeholderTextColor="#6B979A"
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
            autoCorrect={false}
            onFocus={() => setFocusedField('nombre')}
            onBlur={() => setFocusedField(null)}
          />
          {errors.nombre && <Text className="mt-1 text-xs text-red-600">{errors.nombre}</Text>}
        </View>

        <View className="mb-4">
          <Text className="mb-1 text-sm font-inter-semibold text-noche">Email</Text>
          <TextInput
            className={inputClass('email', errors.email)}
            placeholder="tucorreo@ejemplo.com"
            placeholderTextColor="#6B979A"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            onFocus={() => setFocusedField('email')}
            onBlur={() => setFocusedField(null)}
          />
          {errors.email && <Text className="mt-1 text-xs text-red-600">{errors.email}</Text>}
        </View>

        <View className="mb-6">
          <Text className="mb-1 text-sm font-inter-semibold text-noche">Contraseña</Text>
          <TextInput
            className={inputClass('password', errors.password)}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#6B979A"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            onFocus={() => setFocusedField('password')}
            onBlur={() => setFocusedField(null)}
          />
          {errors.password && (
            <Text className="mt-1 text-xs text-red-600">{errors.password}</Text>
          )}
        </View>

        <View className="mb-6">
          <Text className="mb-1 text-sm font-inter-semibold text-noche">
            Tipo de discapacidad (opcional)
          </Text>
          <View className="flex-row flex-wrap gap-2">
            {DISABILITY_OPTIONS.map((opt) => {
              const active = disability === opt.value;
              return (
                <Pressable
                  key={opt.value}
                  onPress={() => setDisability(opt.value)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: active }}
                  className={`rounded-full border-2 px-4 py-2 ${
                    active ? 'border-turquesa bg-turquesa' : 'border-turquesa bg-white'
                  }`}
                >
                  <Text
                    className={`text-xs font-inter-semibold ${
                      active ? 'text-crema' : 'text-noche'
                    }`}
                  >
                    {opt.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-sm font-inter-semibold text-noche">
            Preferencias de accesibilidad
          </Text>
          <View className="rounded-2xl border border-turquesa bg-white p-4">
            <View className="flex-row items-center justify-between gap-3">
              <Text className="flex-1 text-sm text-noche">Lectura en voz alta</Text>
              <Switch
                value={ttsEnabled}
                onValueChange={setTtsEnabled}
                trackColor={{ true: '#17536D', false: '#6B979A' }}
                thumbColor="#F3F4F4"
                accessibilityLabel="Lectura en voz alta"
              />
            </View>
            <View className="my-3 h-px bg-turquesa/20" />
            <View className="flex-row items-center justify-between gap-3">
              <Text className="flex-1 text-sm text-noche">Alto contraste</Text>
              <Switch
                value={highContrast}
                onValueChange={setHighContrast}
                trackColor={{ true: '#17536D', false: '#6B979A' }}
                thumbColor="#F3F4F4"
                accessibilityLabel="Alto contraste"
              />
            </View>
          </View>
        </View>

        <Button
          text={loading ? 'Registrando…' : 'Registrarse'}
          onPress={handleRegister}
          disabled={loading}
        />

        <Link href="/login" className="mt-4 text-center text-turquesa">
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}