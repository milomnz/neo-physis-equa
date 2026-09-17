import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import Button from '../src/components/Button';
import Field from '../src/components/Field';
import { register } from '../src/services/auth';

interface RegisterForm {
  nombre: string;
  email: string;
  password: string;
}

export default function RegisterScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    setLoading(true);
    try {
      await register({
        nombre: data.nombre.trim(),
        email: data.email.trim(),
        password: data.password,
      });
      router.replace('/login');
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
          <Text className="text-2xl font-bold text-neutral-900">Crea tu cuenta</Text>
          <Text className="text-center text-neutral-500">Comienza a usar Neo Physis Equa</Text>
        </View>

        {errors.root?.message && (
          <Text className="rounded-lg bg-red-50 p-3 text-center text-red-700">
            {errors.root.message}
          </Text>
        )}

        <Field
          control={control}
          name="nombre"
          label="Nombre"
          autoCapitalize="words"
          autoCorrect={false}
          placeholder="Tu nombre completo"
          rules={{
            required: 'El nombre es obligatorio',
            minLength: { value: 2, message: 'El nombre debe tener al menos 2 caracteres' },
            maxLength: { value: 100, message: 'El nombre debe tener máximo 100 caracteres' },
          }}
        />
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
          placeholder="Mínimo 6 caracteres"
          rules={{
            required: 'La contraseña es obligatoria',
            minLength: { value: 6, message: 'La contraseña debe tener al menos 6 caracteres' },
          }}
        />

        <Button
          text={loading ? 'Registrando…' : 'Registrarse'}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        />

        <Link href="/login" className="text-center text-blue-600">
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}