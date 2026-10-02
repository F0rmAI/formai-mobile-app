/**
 * Password reset request state and actions.
 *
 * @author Carlos
 * @packageDocumentation
 */

import { useCallback, useState } from 'react';
import { ApiError } from '@/services/api-client';
import { passwordResetService } from '@/services/password-reset.service';
import {
  CONNECTION_ERROR_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  isValidEmail,
} from '@/utils/account-activation';

/**
 * Requests a password-reset link for the client email.
 *
 * @param initialEmail - Email carried over from the sign-in form.
 * @param onSent - Opens the confirmation screen after the request succeeds.
 * @returns The `email`, `error`, `isSubmitting` and request actions.
 *
 * @example
 * ```tsx
 * const recovery = useForgotPassword(email, openConfirmation);
 * ```
 */
export function useForgotPassword(
  initialEmail: string,
  onSent: (email: string) => void,
) {
  const [email, setEmail] = useState(initialEmail);
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changeEmail = useCallback((value: string) => {
    setEmail(value);
    setError(undefined);
  }, []);

  const submit = useCallback(async () => {
    const trimmedEmail = email.trim();
    if (!isValidEmail(trimmedEmail)) {
      setError(INVALID_EMAIL_MESSAGE);
      return;
    }

    setError(undefined);
    setIsSubmitting(true);
    try {
      await passwordResetService.requestLink(trimmedEmail);
      onSent(trimmedEmail);
    } catch (requestError) {
      // The backend rejects an email format with HTTP 400.
      setError(
        requestError instanceof ApiError && requestError.status === 400
          ? INVALID_EMAIL_MESSAGE
          : CONNECTION_ERROR_MESSAGE,
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [email, onSent]);

  return { email, error, isSubmitting, changeEmail, submit };
}
