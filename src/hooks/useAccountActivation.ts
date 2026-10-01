import { useCallback, useState } from 'react';
import {
  accountActivationService,
  isRejectedActivationCode,
} from '@/services/account-activation.service';
import {
  CONNECTION_ERROR_MESSAGE,
  DATA_CONSENT,
  isValidEmail,
  isValidPassword,
} from '@/utils/account-activation';

interface ActivationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
  consent?: string;
  /** Fallo que no pertenece a un campo (p. ej. sin conexión). */
  form?: string;
}

interface ActivationCallbacks {
  onActivated: (email: string) => void;
  /** El código dejó de ser válido entre la verificación y la activación. */
  onCodeRejected: () => void;
}

/** Paso 2 de la activación: correo, contraseña y consentimiento. */
export function useAccountActivation(
  activationCode: string,
  { onActivated, onCodeRejected }: ActivationCallbacks,
) {
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
      found.email = 'Ingresa un correo válido.';
    }
    if (!isValidPassword(password)) {
      found.password =
        'La contraseña debe tener mínimo 8 caracteres, con letras y números.';
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
        password,
        consentAccepted,
        consentVersion: DATA_CONSENT.version,
      });
      onActivated(trimmedEmail);
    } catch (activationError) {
      // Contraseña y consentimiento ya se validaron aquí: un 422 solo puede ser el código.
      if (isRejectedActivationCode(activationError)) {
        onCodeRejected();
      } else {
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
