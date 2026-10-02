/**
 * Client sign-in form state and actions.
 *
 * @author Carlos
 * @packageDocumentation
 */

import { useCallback, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { signInFailureOf } from '@/services/auth.service';
import { isValidEmail } from '@/utils/account-activation';
import { formatTime } from '@/utils/dates';

interface SignInErrors {
  email?: string;
  password?: string;
}

/** Maps a backend sign-in failure to safe client-facing copy. */
function messageOf(error: unknown) {
  const failure = signInFailureOf(error);
  switch (failure.reason) {
    case 'invalid-credentials':
      return 'Correo o contraseña incorrectos. Inténtalo de nuevo.';
    case 'not-allowed':
      return 'Esta cuenta no puede ingresar desde la app. Si eres entrenador, usa la web de FormAI.';
    case 'locked':
      return failure.lockedUntil
        ? `Tu cuenta está bloqueada por intentos fallidos. Podrás intentarlo a las ${formatTime(
            new Date(failure.lockedUntil),
          )}.`
        : 'Tu cuenta está bloqueada por intentos fallidos. Inténtalo más tarde.';
    default:
      return 'No pudimos conectarnos. Revisa tu conexión e inténtalo de nuevo.';
  }
}

/**
 * Manages sign-in credentials, validation and submission state.
 *
 * @param initialEmail - Email carried over from activation or recovery.
 * @returns The credentials, `errors`, `isSubmitting` and form actions.
 *
 * @example
 * ```tsx
 * const signIn = useSignIn(email);
 * ```
 */
export function useSignIn(initialEmail = '') {
  const { signIn } = useAuth();
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<SignInErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changeEmail = useCallback((value: string) => {
    setEmail(value);
    setErrors({});
  }, []);

  const changePassword = useCallback((value: string) => {
    setPassword(value);
    setErrors({});
  }, []);

  const submit = useCallback(async () => {
    const trimmedEmail = email.trim();
    if (!isValidEmail(trimmedEmail)) {
      setErrors({ email: 'Ingresa un correo válido.' });
      return;
    }
    if (!password) {
      setErrors({ password: 'Ingresa tu contraseña.' });
      return;
    }

    setErrors({});
    setIsSubmitting(true);
    try {
      // The navigator replaces the access flow after successful sign-in.
      await signIn({ email: trimmedEmail, password });
    } catch (error) {
      setErrors({ password: messageOf(error) });
      setIsSubmitting(false);
    }
  }, [email, password, signIn]);

  return {
    email,
    password,
    errors,
    isSubmitting,
    changeEmail,
    changePassword,
    submit,
  };
}
