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
  /** Canjea el código: define la contraseña y registra el consentimiento. */
  activate: (input: ActivateAccountInput) =>
    apiClient.post<AccountActivation>('/v1/account-activations', input),
};

/** El backend responde 422 cuando el código no existe, venció o ya se usó. */
export const isRejectedActivationCode = (error: unknown) =>
  error instanceof ApiError && (error.status === 422 || error.status === 400);
