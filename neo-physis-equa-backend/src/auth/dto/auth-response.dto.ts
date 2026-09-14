export interface AuthResponse {
  token: string | null;
  id: string;
  nombre: string;
  email: string;
  mensaje: string;
}