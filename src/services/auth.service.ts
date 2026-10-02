/**
 * Cookie-backed authentication resource.
 *
 * @author Carlos
 * @packageDocumentation
 */

import { ApiError, apiClient, refreshSession } from './api-client';
import type {
  AuthenticatedUser,
  PasswordResetInput,
  SignInInput,
} from '@/types/auth';

/**
 * Authentication resource. The backend stores access and refresh tokens in
 * httpOnly cookies; the app only forwards them.
 */
export const authService = {
  /** Clients sign in through the mobile application only. */
  signIn: ({ email, password }: SignInInput) =>
    apiClient.post<AuthenticatedUser>('/v1/authentication/sign-in', {
      email,
      password,
      application: 'MOBILE_APP',
    }),
  /** Renews the session through the shared refresh request. */
  refresh: () => refreshSession<AuthenticatedUser>(),
  /** Revokes the refresh token and clears server cookies. */
  signOut: () => apiClient.post<void>('/v1/authentication/sign-out'),
  /**
   * Requests a password-reset link without revealing account existence.
   */
  requestPasswordReset: (email: string) =>
    apiClient.post<void>('/v1/password-reset-requests', { email }),
  /** Redeems a reset token and replaces the account password. */
  resetPassword: (input: PasswordResetInput) =>
    apiClient.post<void>('/v1/password-resets', input),
};

/** Reason for a rejected sign-in. */
export type SignInFailure =
  | { reason: 'invalid-credentials' }
  | { reason: 'not-allowed' }
  | { reason: 'locked'; lockedUntil?: string }
  | { reason: 'unavailable' };

/** Maps sign-in errors without displaying backend details. */
export function signInFailureOf(error: unknown): SignInFailure {
  if (!(error instanceof ApiError)) {
    return { reason: 'unavailable' };
  }
  // Treat an invalid email format like invalid credentials.
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
 * Identifies an invalid or expired reset link after local password validation.
 */
export const isRejectedResetLink = (error: unknown) =>
  error instanceof ApiError && (error.status === 422 || error.status === 400);
