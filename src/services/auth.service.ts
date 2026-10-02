/**
 * Cookie-backed authentication resource.
 *
 * @author Carlos
 * @packageDocumentation
 */

import { ApiError, apiClient, refreshSession } from './api-client';
import type { AuthenticatedUser, SignInInput } from '@/types/auth';

/**
 * Authentication resource. The backend stores access and refresh tokens in
 * httpOnly cookies; the app only forwards them.
 */
export const authService = {
  /**
   * Signs in a client through the mobile application.
   *
   * @param input - Email and password entered by the client.
   * @returns The authenticated account returned by the backend.
   * @throws {@link ApiError} when credentials are rejected.
   */
  signIn: ({ email, password }: SignInInput) =>
    apiClient.post<AuthenticatedUser>('/v1/authentication/sign-in', {
      email,
      password,
      application: 'MOBILE_APP',
    }),
  /**
   * Renews the session through the shared refresh request.
   *
   * @returns The authenticated account associated with the renewed session.
   * @throws {@link ApiError} when the refresh cookie is rejected.
   */
  refresh: () => refreshSession<AuthenticatedUser>(),
  /**
   * Revokes the refresh token and clears server cookies.
   *
   * @returns Resolves after the backend ends the session.
   * @throws {@link ApiError} when the sign-out request fails.
   */
  signOut: () => apiClient.post<void>('/v1/authentication/sign-out'),
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
