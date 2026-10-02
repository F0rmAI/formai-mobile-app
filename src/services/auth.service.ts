import { ApiError, apiClient } from './api-client';
import type {
  AuthenticatedUser,
  PasswordResetInput,
  SignInInput,
} from '@/types/auth';

/**
 * Acceso a la cuenta. El backend entrega el JWT y el refresh token en cookies
 * httpOnly: la app nunca los lee, solo los reenvía con cada llamada.
 */
export const authService = {
  /** Los clientes solo pueden ingresar desde la app móvil (`MOBILE_APP`). */
  signIn: ({ email, password }: SignInInput) =>
    apiClient.post<AuthenticatedUser>('/v1/authentication/sign-in', {
      email,
      password,
      application: 'MOBILE_APP',
    }),
  /** Renueva la sesión con la cookie de refresh; responde 401 si no hay sesión. */
  refresh: () =>
    apiClient.post<AuthenticatedUser>('/v1/authentication/refresh'),
  /** Revoca el refresh token y borra las cookies de sesión en el backend. */
  signOut: () => apiClient.post<void>('/v1/authentication/sign-out'),
  /**
   * Pide el correo con el enlace para crear una nueva contraseña. El backend
   * responde igual exista o no la cuenta, para no revelar qué correos están registrados.
   */
  requestPasswordReset: (email: string) =>
    apiClient.post<void>('/v1/password-reset-requests', { email }),
  /** Canjea el token del enlace y reemplaza la contraseña de la cuenta. */
  resetPassword: (input: PasswordResetInput) =>
    apiClient.post<void>('/v1/password-resets', input),
};

/** Por qué el backend rechazó el inicio de sesión. */
export type SignInFailure =
  | { reason: 'invalid-credentials' }
  | { reason: 'not-allowed' }
  | { reason: 'locked'; lockedUntil?: string }
  | { reason: 'unavailable' };

export function signInFailureOf(error: unknown): SignInFailure {
  if (!(error instanceof ApiError)) {
    return { reason: 'unavailable' };
  }
  // 400: el backend no reconoce el formato del correo; para el cliente es lo mismo.
  if (error.status === 401 || error.status === 400) {
    return { reason: 'invalid-credentials' };
  }
  if (error.status === 403) {
    return { reason: 'not-allowed' };
  }
  if (error.status === 429) {
    const body = error.body as { lockedUntil?: string } | undefined;
    return { reason: 'locked', lockedUntil: body?.lockedUntil };
  }
  return { reason: 'unavailable' };
}

/**
 * El backend responde 422 cuando el enlace no existe, venció o ya se usó (400 si el
 * token llega vacío). La contraseña se valida en la app: un 422 solo puede ser el enlace.
 */
export const isRejectedResetLink = (error: unknown) =>
  error instanceof ApiError && (error.status === 422 || error.status === 400);
