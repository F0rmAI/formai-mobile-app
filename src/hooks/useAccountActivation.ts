/**
 * Account activation form state and actions.
 *
 * @author Carlos
 * @packageDocumentation
 */

import { useCallback, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import {
  accountActivationService,
  activationFailureOf,
} from '@/services/account-activation.service';
import { signInFailureOf } from '@/services/auth.service';
import {
  CONNECTION_ERROR_MESSAGE,
  DATA_CONSENT,
  ACTIVATION_CONFLICT_MESSAGE,
  INVALID_EMAIL_MESSAGE,
  isValidEmail,
  isValidPassword,
} from '@/utils/account-activation';

interface ActivationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  consent?: string;
  /** Failure unrelated to one field, such as a connection error. */
  form?: string;
}

interface ActivationCallbacks {
  /** Opens manual sign-in if authentication after activation is unavailable. */
  onActivated: (email: string, sessionNotPersisted: boolean) => void;
  /** The code became invalid between verification and activation. */
  onCodeRejected: () => void;
}

/**
 * Validates credentials and consent before activating a client account.
 *
 * @param activationCode - Code previously verified with the backend.
 * @param callbacks - Navigation actions after activation or code rejection.
 * @returns The field values, `errors`, `isSubmitting` and form actions.
 *
 * @example
 * ```tsx
 * const activation = useAccountActivation(code, { onActivated, onCodeRejected });
 * ```
 */
export function useAccountActivation(
  activationCode: string,
  { onActivated, onCodeRejected }: ActivationCallbacks,
) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [consentAccepted, setConsentAccepted] = useState(false);
  const [errors, setErrors] = useState<ActivationErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clearError = (field: keyof ActivationErrors) =>
    setErrors(current => ({ ...current, [field]: undefined, form: undefined }));

  const changeEmail = useCallback((value: string) => {
    setEmail(value);
    clearError('email');
  }, []);

  const changePassword = useCallback((value: string) => {
    setPassword(value);
    clearError('password');
  }, []);

  const changeConfirmPassword = useCallback((value: string) => {
    setConfirmPassword(value);
    clearError('confirmPassword');
  }, []);

  const changeConsent = useCallback((accepted: boolean) => {
    setConsentAccepted(accepted);
    clearError('consent');
  }, []);

  const submit = useCallback(async () => {
    const trimmedEmail = email.trim();
    const found: ActivationErrors = {};
    if (!isValidEmail(trimmedEmail)) {
      found.email = INVALID_EMAIL_MESSAGE;
    }
    if (!isValidPassword(password)) {
      found.password = 'La contraseña debe tener entre 8 y 128 caracteres.';
    } else if (confirmPassword !== password) {
      found.confirmPassword = 'Las contraseñas no coinciden.';
    }
    if (!consentAccepted) {
      found.consent =
        'Debes aceptar el tratamiento de tus datos para activar tu cuenta.';
    }
    setErrors(found);
    if (Object.keys(found).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await accountActivationService.activate({
        activationCode,
        email: trimmedEmail,
        password,
        consentAccepted,
        consentVersion: DATA_CONSENT.version,
      });
      try {
        await signIn({ email: trimmedEmail, password });
      } catch (signInError) {
        onActivated(
          trimmedEmail,
          signInFailureOf(signInError).reason === 'sessionNotPersisted',
        );
      }
    } catch (activationError) {
      switch (activationFailureOf(activationError)) {
        case 'code-rejected':
          onCodeRejected();
          break;
        case 'account-conflict':
          setErrors({ form: ACTIVATION_CONFLICT_MESSAGE });
          break;
        case 'invalid-email':
          setErrors({ email: INVALID_EMAIL_MESSAGE });
          break;
        default:
          setErrors({ form: CONNECTION_ERROR_MESSAGE });
      }
      setIsSubmitting(false);
    }
  }, [
    activationCode,
    confirmPassword,
    consentAccepted,
    email,
    onActivated,
    onCodeRejected,
    password,
    signIn,
  ]);

  return {
    email,
    password,
    confirmPassword,
    consentAccepted,
    errors,
    isSubmitting,
    changeEmail,
    changePassword,
    changeConfirmPassword,
    changeConsent,
    submit,
  };
}
