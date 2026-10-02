/**
 * Password reset redemption state and actions.
 *
 * @author Carlos
 * @packageDocumentation
 */

import { useCallback, useState } from 'react';
import {
  isRejectedResetLink,
  passwordResetService,
} from '@/services/password-reset.service';
import {
  CONNECTION_ERROR_MESSAGE,
  isValidPassword,
} from '@/utils/account-activation';

interface ResetPasswordErrors {
  password?: string;
  confirmPassword?: string;
  /** Failure unrelated to either field, such as loss of connectivity. */
  form?: string;
}

/**
 * Redeems a password-reset token and validates the new credentials.
 *
 * @param token - Single-use token from the email deep link.
 * @param onReset - Opens sign-in after the password changes.
 * @returns The field values, `errors`, `isSubmitting`, `isLinkExpired` and actions.
 *
 * @example
 * ```tsx
 * const recovery = useResetPassword(token, openSignIn);
 * ```
 */
export function useResetPassword(
  token: string | undefined,
  onReset: () => void,
) {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<ResetPasswordErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRejected, setIsRejected] = useState(false);
  // A link without a token is invalid even if this screen is already open.
  const isLinkExpired = !token || isRejected;

  const clearError = (field: keyof ResetPasswordErrors) =>
    setErrors(current => ({ ...current, [field]: undefined, form: undefined }));

  const changePassword = useCallback((value: string) => {
    setPassword(value);
    clearError('password');
  }, []);

  const changeConfirmPassword = useCallback((value: string) => {
    setConfirmPassword(value);
    clearError('confirmPassword');
  }, []);

  const submit = useCallback(async () => {
    if (!token) {
      return;
    }
    if (!isValidPassword(password)) {
      setErrors({
        password:
          'La contraseña debe tener mínimo 8 caracteres, con letras y números.',
      });
      return;
    }
    if (confirmPassword !== password) {
      setErrors({ confirmPassword: 'Las contraseñas no coinciden.' });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      await passwordResetService.resetPassword({ token, password });
      onReset();
    } catch (resetError) {
      if (isRejectedResetLink(resetError)) {
        setIsRejected(true);
      } else {
        setErrors({ form: CONNECTION_ERROR_MESSAGE });
      }
      setIsSubmitting(false);
    }
  }, [confirmPassword, onReset, password, token]);

  return {
    password,
    confirmPassword,
    errors,
    isSubmitting,
    isLinkExpired,
    changePassword,
    changeConfirmPassword,
    submit,
  };
}
