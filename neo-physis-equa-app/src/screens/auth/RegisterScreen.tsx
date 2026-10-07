import { KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { Link, useRouter } from 'expo-router';
import Button from '../../components/Button';
import AuthHeader from './components/AuthHeader';
import DisabilitySelector from './components/DisabilitySelector';
import AccessibilityPreferences from './components/AccessibilityPreferences';
import { useRegister, type AuthFieldName } from '../../hooks/useRegister';

export default function RegisterScreen() {
  const router = useRouter();
  const {
    nombre,
    setNombre,
    email,
    setEmail,
    password,
    setPassword,
    disability,
    setDisability,
    ttsEnabled,
    setTtsEnabled,
    highContrast,
    setHighContrast,
    focusedField,
    setFocusedField,
    errors,
    loading,
    error,
    submit,
  } = useRegister();

  const handleSubmit = async () => {
    if (await submit()) {
      router.replace('/login');
    }
  };

  const inputClass = (field: AuthFieldName, hasError?: string) =>
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
        <AuthHeader
          title="Neo Physis Equa"
          subtitle="Crea tu cuenta para comenzar"
          titleClassName="mb-1 text-3xl"
          subtitleClassName="mb-8 text-sm"
        />

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

        <DisabilitySelector value={disability} onChange={setDisability} />

        <AccessibilityPreferences
          ttsEnabled={ttsEnabled}
          highContrast={highContrast}
          onTtsChange={setTtsEnabled}
          onHighContrastChange={setHighContrast}
        />

        <Button
          text={loading ? 'Registrando…' : 'Registrarse'}
          onPress={handleSubmit}
          disabled={loading}
        />

        <Link href="/login" className="mt-4 text-center text-turquesa">
          ¿Ya tienes cuenta? Inicia sesión
        </Link>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}