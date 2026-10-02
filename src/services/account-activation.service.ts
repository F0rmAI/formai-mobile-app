/**
 * Account activation API resource.
 *
 * @author Carlos
 * @packageDocumentation
 */

import { ApiError, apiClient } from './api-client';
import type {
  AccountActivation,
  ActivateAccountInput,
  ActivationCodeVerification,
} from '@/types/account-activation';

/** Calls the account activation and transfer endpoints. */
export const accountActivationService = {
  /**
   * Verifies an activation code without consuming it.
   *
   * @param activationCode - Code provided by the trainer.
   * @returns The code expiration supplied by the backend.
   * @throws {@link ApiError} when the code is rejected.
   */
  verifyCode: (activationCode: string) =>
    apiClient.post<ActivationCodeVerification>(
      '/v1/activation-code-verifications',
      { activationCode },
    ),
  /**
   * Redeems the code with account credentials and consent.
   *
   * @param input - Code, credentials and accepted consent version.
   * @returns The activated or transferred account.
   * @throws {@link ApiError} when the code or account data is rejected.
   */
  activate: (input: ActivateAccountInput) =>
    apiClient.post<AccountActivation>('/v1/account-activations', input),
};

/** A rejected code yields HTTP 422 or validation error 400. */
export const isRejectedActivationCode = (error: unknown) =>
  error instanceof ApiError && (error.status === 422 || error.status === 400);

/** Reason for an activation rejection. */
export type ActivationFailure =
  | 'code-rejected'
  | 'account-conflict'
  | 'invalid-email'
  | 'unavailable';

/** Maps activation responses without exposing account ownership. */
export function activationFailureOf(error: unknown): ActivationFailure {
  if (!(error instanceof ApiError)) {
    return 'unavailable';
  }
  switch (error.status) {
    // The app validates password range and consent before submission.
    case 422:
      return 'code-rejected';
    // A different account owns the email, or the existing password is wrong.
    case 409:
      return 'account-conflict';
    case 400:
      return 'invalid-email';
    default:
      return 'unavailable';
  }
}
