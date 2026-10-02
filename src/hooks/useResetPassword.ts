import { useCallback, useState } from 'react';
import { authService, isRejectedResetLink } from '@/services/auth.service';
import {
  CONNECTION_ERROR_MESSAGE,
  isValidPassword,
} from '@/utils/account-activation';

interface ResetPasswordErrors {
  password?: string;
  confirmPassword?: string;
  /** Fallo que no pertenece a un campo (p. ej. sin conexión). */
  form?: string;
}

/**
 * Recuperación de contraseña, paso 2: el cliente crea una nueva contraseña con el
 * token del enlace. `isLinkExpired` indica que el enlace falta, venció o ya se usó.
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
  // Un enlace sin token tampoco sirve, aunque llegue con la pantalla ya abierta.
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
      await authService.resetPassword({ token, password });
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
