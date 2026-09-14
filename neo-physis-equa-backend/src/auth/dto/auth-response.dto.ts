export interface AuthResponse {
  token: string | null;
  id: string;
  nombre: string;
  email: string;
  mensaje: string;
  role?: string;
  accessibilityProfile?: Record<string, unknown> | null;
  disabilityType?: string | null;
}