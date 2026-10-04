/**
 * Password-reset request and redemption resource.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { ApiError, apiClient } from './api-client';
import type { PasswordResetInput } from '@/types/auth';

/**
 * Calls the password-reset endpoints without exposing account existence.
 */
export const passwordResetService = {
  /**
   * Requests a reset link for an email address.
   *
   * @param email - Address entered by the client.
   * @returns Resolves after the backend accepts the request.
   * @throws {@link ApiError} when the backend rejects the request.
   */
  requestLink: (email: string) =>
    apiClient.post<void>('/password-reset-requests', { email }),
  /**
   * Redeems a token and stores the new password.
   *
   * @param input - Token from the email link and new account password.
   * @returns Resolves after the password is replaced.
   * @throws {@link ApiError} when the link is invalid or expired.
   */
  resetPassword: (input: PasswordResetInput) =>
    apiClient.post<void>('/password-resets', input),
};

/**
 * Identifies an invalid or expired reset link after local password validation.
 *
 * @param error - Failure returned while redeeming the link.
 * @returns Whether the backend rejected the link itself.
 */
export const isRejectedResetLink = (error: unknown) =>
  error instanceof ApiError && (error.status === 422 || error.status === 400);
