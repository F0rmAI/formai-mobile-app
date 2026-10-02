import { useCallback, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { signInFailureOf } from '@/services/auth.service';
import { isValidEmail } from '@/utils/account-activation';
import { formatTime } from '@/utils/dates';

interface SignInErrors {
  email?: string;
  password?: string;
}

/** Traduce el rechazo del backend al mensaje que ve el cliente. */
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

/** Formulario de inicio de sesión: valores, validación, envío y errores. */
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
      // Si la sesión se inicia, el navegador reemplaza el acceso por las pestañas.
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
