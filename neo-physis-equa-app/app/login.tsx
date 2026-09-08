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
import { Link } from 'expo-router';
import { login, type LoginData } from '../src/services/auth';
import { saveSession } from '../src/services/session';

interface FormErrors {
  email?: string;
  password?: string;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = (): boolean => {
    const next: FormErrors = {};

    if (!email.trim()) {
      next.email = 'El email es obligatorio';
    } else if (!EMAIL_REGEX.test(email.trim())) {
      next.email = 'El email debe ser válido';
    }

    if (!password) {
      next.password = 'La contraseña es obligatoria';
    }

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleLogin = async () => {
    setApiError(null);
    setSuccess(null);

    if (!validate()) {
      return;
    }

    const payload: LoginData = {
      email: email.trim(),
      password,
    };

    setLoading(true);
    try {
      const response = await login(payload);
      if (response.token) {
        await saveSession({
          token: response.token,
          id: response.id,
          nombre: response.nombre,
          email: response.email,
        });
      }
      setSuccess(response.mensaje ?? 'Login exitoso');
      setPassword('');
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

  const inputClass =
    'rounded-xl border border-slate-700 bg-slate-800 px-4 py-3 text-base text-white';

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-slate-900"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-6 py-10"
        keyboardShouldPersistTaps="handled"
      >
        <View className="items-center">
          <View className="mb-2 h-16 w-16 items-center justify-center rounded-2xl bg-blue-500">
            <Text className="text-2xl font-bold text-white">N</Text>
          </View>
          <Text className="mb-1 text-3xl font-bold text-white">Neo Physis Equa</Text>
          <Text className="mb-8 text-center text-sm text-slate-400">
            Inicia sesión en tu cuenta
          </Text>
        </View>

        {apiError && (
          <View className="mb-4 rounded-xl border border-red-500 bg-red-500/10 p-3">
            <Text className="text-center text-sm text-red-400">{apiError}</Text>
          </View>
        )}

        {success && (
          <View className="mb-4 rounded-xl border border-green-500 bg-green-500/10 p-3">
            <Text className="text-center text-sm text-green-400">{success}</Text>
          </View>
        )}

        <View className="mb-4">
          <Text className="mb-1 text-sm font-medium text-slate-300">Email</Text>
          <TextInput
            className={inputClass}
            placeholder="tucorreo@ejemplo.com"
            placeholderTextColor="#64748b"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
          />
          {errors.email && <Text className="mt-1 text-xs text-red-400">{errors.email}</Text>}
        </View>

        <View className="mb-6">
          <Text className="mb-1 text-sm font-medium text-slate-300">Contraseña</Text>
          <TextInput
            className={inputClass}
            placeholder="Tu contraseña"
            placeholderTextColor="#64748b"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />
          {errors.password && (
            <Text className="mt-1 text-xs text-red-400">{errors.password}</Text>
          )}
        </View>

        <TouchableOpacity
          onPress={handleLogin}
          disabled={loading}
          className="items-center rounded-xl bg-blue-500 py-3.5 disabled:opacity-50"
        >
          {loading ? (
            <ActivityIndicator color="#ffffff" />
          ) : (
            <Text className="text-base font-semibold text-white">Iniciar sesión</Text>
          )}
        </TouchableOpacity>

        <View className="mt-6 flex-row justify-center">
          <Text className="text-sm text-slate-400">¿No tienes cuenta? </Text>
          <Link href="/register" className="text-sm font-semibold text-blue-400">
            Regístrate
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}