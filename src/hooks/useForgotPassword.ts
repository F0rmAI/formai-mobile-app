import { useCallback, useState } from 'react';
import { ApiError } from '@/services/api-client';
import { authService } from '@/services/auth.service';
import {
  CONNECTION_ERROR_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  isValidEmail,
} from '@/utils/account-activation';

/**
 * Recuperación de contraseña, paso 1: el cliente escribe su correo y el backend
 * le envía el enlace para crear una nueva contraseña.
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
      await authService.requestPasswordReset(trimmedEmail);
      onSent(trimmedEmail);
    } catch (requestError) {
      // 400: el backend no reconoce el formato del correo.
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
