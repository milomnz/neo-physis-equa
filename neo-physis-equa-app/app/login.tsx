import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import Button from '../src/components/Button';
import Field from '../src/components/Field';
import { login } from '../src/services/auth';
import { saveSession } from '../src/services/session';

interface LoginForm {
  email: string;
  password: string;
}

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    setLoading(true);
    try {
      const response = await login({ email: data.email.trim(), password: data.password });
      if (response.token) {
        await saveSession({
          token: response.token,
          id: response.id,
          nombre: response.nombre,
          email: response.email,
        });
      }
      router.replace('/home');
    } catch (err) {
      setError('root', {
        type: 'manual',
        message: err instanceof Error ? err.message : 'Error inesperado del servidor',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-neutral-50"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 justify-center gap-5 p-6">
        <View className="items-center gap-1">
          <View className="mb-2 h-16 w-16 items-center justify-center rounded-2xl bg-blue-600">
            <Text className="text-2xl font-bold text-white">N</Text>
          </View>
          <Text className="text-2xl font-bold text-neutral-900">Neo Physis Equa</Text>
          <Text className="text-center text-neutral-500">Inicia sesión en tu cuenta</Text>
        </View>

        {errors.root?.message && (
          <Text className="rounded-lg bg-red-50 p-3 text-center text-red-700">
            {errors.root.message}
          </Text>
        )}

        <Field
          control={control}
          name="email"
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="tucorreo@ejemplo.com"
          rules={{
            required: 'El email es obligatorio',
            pattern: { value: /^\S+@\S+\.\S+$/, message: 'El email debe ser válido' },
          }}
        />
        <Field
          control={control}
          name="password"
          label="Contraseña"
          secureTextEntry
          autoCapitalize="none"
          placeholder="Tu contraseña"
          rules={{ required: 'La contraseña es obligatoria' }}
        />

        <Button
          text={loading ? 'Iniciando…' : 'Iniciar sesión'}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        />

        <Link href="/register" className="text-center text-blue-600">
          ¿No tienes cuenta? Regístrate
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}