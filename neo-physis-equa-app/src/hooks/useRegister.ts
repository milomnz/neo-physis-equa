import { useState } from 'react';
import { register as registerRequest, type RegisterData } from '../services/auth';
import { validateRegisterForm, type RegisterFieldErrors } from '../utils/auth-validators';

export type AuthFieldName = 'nombre' | 'email' | 'password';

interface UseRegisterResult {
  nombre: string;
  setNombre: (value: string) => void;
  email: string;
  setEmail: (value: string) => void;
  password: string;
  setPassword: (value: string) => void;
  disability: string;
  setDisability: (value: string) => void;
  ttsEnabled: boolean;
  setTtsEnabled: (value: boolean) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  focusedField: AuthFieldName | null;
  setFocusedField: (field: AuthFieldName | null) => void;
  errors: RegisterFieldErrors;
  loading: boolean;
  error: string | null;
  submit: () => Promise<boolean>;
}

export function useRegister(): UseRegisterResult {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [disability, setDisability] = useState('ninguna');
  const [ttsEnabled, setTtsEnabled] = useState(true);
  const [highContrast, setHighContrast] = useState(false);
  const [focusedField, setFocusedField] = useState<AuthFieldName | null>(null);
  const [errors, setErrors] = useState<RegisterFieldErrors>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (): Promise<boolean> => {
    const next = validateRegisterForm({ nombre, email, password });
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return false;
    }
    setErrors({});
    setLoading(true);
    setError(null);
    try {
      const payload: RegisterData = {
        name: nombre.trim(),
        email: email.trim(),
        password,
        disabilityType: disability === 'ninguna' ? null : disability,
        accessibilityProfile: { ttsEnabled, highContrast },
      };
      await registerRequest(payload);
      setNombre('');
      setEmail('');
      setPassword('');
      return true;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error inesperado del servidor');
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
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
  };
}