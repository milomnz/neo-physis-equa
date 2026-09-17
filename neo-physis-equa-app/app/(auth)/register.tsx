import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { register, type RegisterData } from '../../src/services/auth';

interface FormErrors {
  nombre?: string;
  email?: string;
  password?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const DISABILITY_OPTIONS = [
  { value: 'ninguna', label: 'Ninguna' },
  { value: 'motora', label: 'Motora' },
  { value: 'visual', label: 'Visual' },
  { value: 'auditiva', label: 'Auditiva' },
  { value: 'intelectual', label: 'Intelectual' },
];

export default function RegisterScreen() {
  const router = useRouter();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [disability, setDisability] = useState('ninguna');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);

  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!nombre.trim()) {
      next.nombre = 'El nombre es obligatorio';
    } else if (nombre.trim().length < 2 || nombre.trim().length > 100) {
      next.nombre = 'El nombre debe tener entre 2 y 100 caracteres';
    }

    if (!email.trim()) {
      next.email = 'El email es obligatorio';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      next.email = 'El email debe ser válido';
    }

    if (!password) {
      next.password = 'La contraseña es obligatoria';
    } else if (password.length < 6) {
      next.password = 'La contraseña debe tener al menos 6 caracteres';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleRegister = async () => {
    setApiError(null);

    if (!validate()) {
      return;
    }

    const payload: RegisterData = {
      name: nombre.trim(),
      email: email.trim(),
      password,
      disabilityType: disability === 'ninguna' ? null : disability,
      accessibilityProfile: { ttsEnabled, highContrast },
    };

    setLoading(true);
    try {
      await register(payload);
      setNombre('');
      setEmail('');
      setPassword('');
      router.replace('/login');
    } catch (err) {
      if (err instanceof Error) {
        setApiError(err.message);
      } else {
        setApiError('Error inesperado del servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (hasError?: string) =>
    `rounded-xl border bg-white px-4 py-3 text-base text-slate-800 ${hasError ? 'border-red-400' : 'border-slate-300'
    }`;

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-10"
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center">
          <View className="mb-2 h-16 w-16 items-center justify-center rounded-2xl bg-emerald-500 shadow-sm">
            <Text className="text-2xl font-bold text-white">N</Text>
          </View>
          <Text className="mb-1 text-3xl font-bold text-slate-900">Neo Physis Equa</Text>
          <Text className="mb-8 text-center text-sm text-slate-500">
            Crea tu cuenta para comenzar
          </Text>
        </View>

        {apiError && (
          <View className="mb-4 rounded-xl border border-red-500 bg-red-50 p-3">
            <Text className="text-center text-sm text-red-600">{apiError}</Text>
          </View>
        )}

        <View className="mb-4">
          <Text className="mb-1 text-sm font-medium text-slate-700">Nombre</Text>
          <TextInput
            className={inputClass(errors.nombre)}
            placeholder="Tu nombre completo"
            placeholderTextColor="#94a3b8"
            value={nombre}
            onChangeText={setNombre}
            autoCapitalize="words"
            autoCorrect={false}
          />
          {errors.nombre && <Text className="mt-1 text-xs text-red-500">{errors.nombre}</Text>}
        </View>

        <View className="mb-4">
          <Text className="mb-1 text-sm font-medium text-slate-700">Email</Text>
          <TextInput
            className={inputClass(errors.email)}
            placeholder="tucorreo@ejemplo.com"
            placeholderTextColor="#94a3b8"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
          {errors.email && <Text className="mt-1 text-xs text-red-500">{errors.email}</Text>}
        </View>

        <View className="mb-6">
          <Text className="mb-1 text-sm font-medium text-slate-700">Contraseña</Text>
          <TextInput
            className={inputClass(errors.password)}
            placeholder="Mínimo 6 caracteres"
            placeholderTextColor="#94a3b8"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          {errors.password && (
            <Text className="mt-1 text-xs text-red-500">{errors.password}</Text>
          )}
        </View>

        <View className="mb-6">
          <Text className="mb-1 text-sm font-medium text-slate-700">Tipo de discapacidad (opcional)</Text>
          <View className="flex-row flex-wrap gap-2">
            {DISABILITY_OPTIONS.map((opt) => {
              const active = disability === opt.value;
              return (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setDisability(opt.value)}
                  className={`rounded-full border px-4 py-2 ${active ? 'border-emerald-500 bg-emerald-500' : 'border-slate-300 bg-white'
                    }`}
                >
                  <Text className={`text-sm ${active ? 'font-medium text-white' : 'text-slate-700'}`}>
                    {opt.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View className="mb-6">
          <Text className="mb-2 text-sm font-medium text-slate-700">Preferencias de accesibilidad</Text>
          <View className="space-y-2">
            <TouchableOpacity
              onPress={() => setTtsEnabled((v) => !v)}
              className={`flex-row items-center justify-between rounded-xl border px-4 py-3 ${ttsEnabled ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-white'
                }`}
            >
              <Text className="text-sm text-slate-700">Lectura en voz alta</Text>
              <Text className={`text-sm font-semibold ${ttsEnabled ? 'text-emerald-600' : 'text-slate-400'}`}>
                {ttsEnabled ? 'Activada' : 'Desactivada'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setHighContrast((v) => !v)}
              className={`flex-row items-center justify-between rounded-xl border px-4 py-3 ${highContrast ? 'border-emerald-500 bg-emerald-50' : 'border-slate-300 bg-white'
                }`}
            >
              <Text className="text-sm text-slate-700">Alto contraste</Text>
              <Text className={`text-sm font-semibold ${highContrast ? 'text-emerald-600' : 'text-slate-400'}`}>
                {highContrast ? 'Activada' : 'Desactivada'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          onPress={handleRegister}
          disabled={loading}
          className="items-center rounded-xl bg-emerald-500 py-3.5 shadow-sm disabled:opacity-50"
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-base font-semibold text-white">Registrarse</Text>
          )}
        </TouchableOpacity>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-sm text-slate-500">¿Ya tienes cuenta? </Text>
          <Link href="/login" className="text-sm font-semibold text-emerald-600">
            Inicia sesión
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}