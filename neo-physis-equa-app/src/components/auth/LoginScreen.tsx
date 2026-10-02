import { KeyboardAvoidingView, Platform, Text, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { useForm } from 'react-hook-form';
import Button from '../Button';
import Field from '../Field';
import { LOGIN_FIELD_RULES, type LoginForm } from './validators';
import { useLogin } from './useLogin';

export default function LoginScreen() {
  const router = useRouter();
  const { loading, error, login } = useLogin();

  const {
    control,
    handleSubmit,
  } = useForm<LoginForm>();

  const onSubmit = async (data: LoginForm) => {
    if (await login(data)) {
      router.replace('/home');
    }
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-crema"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View className="flex-1 justify-center gap-5 p-6">
        <View className="items-center gap-1">
          <View className="mb-2 h-16 w-16 items-center justify-center rounded-2xl bg-turquesa">
            <Text className="text-2xl font-bricolage text-crema">N</Text>
          </View>
          <Text className="text-2xl font-bricolage text-noche">Neo Physis Equa</Text>
          <Text className="text-center text-turquesa">Inicia sesión en tu cuenta</Text>
        </View>

        {error && (
          <Text className="rounded-lg bg-red-50 p-3 text-center text-red-700">{error}</Text>
        )}

        <Field
          control={control}
          name="email"
          label="Email"
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          placeholder="tucorreo@ejemplo.com"
          rules={LOGIN_FIELD_RULES.email}
        />
        <Field
          control={control}
          name="password"
          label="Contraseña"
          secureTextEntry
          autoCapitalize="none"
          placeholder="Tu contraseña"
          rules={LOGIN_FIELD_RULES.password}
        />

        <Button
          text={loading ? 'Iniciando…' : 'Iniciar sesión'}
          onPress={handleSubmit(onSubmit)}
          disabled={loading}
        />

        <Link href="/register" className="text-center text-turquesa">
          ¿No tienes cuenta? Regístrate
        </Link>
      </View>
    </KeyboardAvoidingView>
  );
}