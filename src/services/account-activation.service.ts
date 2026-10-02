import { ApiError, apiClient } from './api-client';
import type {
  AccountActivation,
  ActivateAccountInput,
  ActivationCodeVerification,
} from '@/types/account-activation';

/** Activación de la cuenta que el entrenador creó para el cliente. */
export const accountActivationService = {
  /** Comprueba que el código exista y no haya vencido; no lo consume. */
  verifyCode: (activationCode: string) =>
    apiClient.post<ActivationCodeVerification>(
      '/v1/activation-code-verifications',
      { activationCode },
    ),
  /** Canjea el código: registra el correo y la contraseña del cliente y su consentimiento. */
  activate: (input: ActivateAccountInput) =>
    apiClient.post<AccountActivation>('/v1/account-activations', input),
};

/** El backend responde 422 cuando el código no existe, venció o ya se usó. */
export const isRejectedActivationCode = (error: unknown) =>
  error instanceof ApiError && (error.status === 422 || error.status === 400);

/** Por qué el backend rechazó la activación de la cuenta. */
export type ActivationFailure =
  | 'code-rejected'
  | 'email-taken'
  | 'invalid-email'
  | 'unavailable';

export function activationFailureOf(error: unknown): ActivationFailure {
  if (!(error instanceof ApiError)) {
    return 'unavailable';
  }
  switch (error.status) {
    // Contraseña y consentimiento se validan en la app: un 422 solo puede ser el código.
    case 422:
      return 'code-rejected';
    // Otra cuenta ya usa ese correo.
    case 409:
      return 'email-taken';
    case 400:
      return 'invalid-email';
    default:
      return 'unavailable';
  }
}
