import { useCallback, useState } from 'react';
import {
  accountActivationService,
  isRejectedActivationCode,
} from '@/services/account-activation.service';
import {
  CONNECTION_ERROR_MESSAGE,
  INVALID_CODE_MESSAGE,
  normalizeActivationCode,
} from '@/utils/account-activation';

/** Paso 1 de la activación: el cliente escribe el código y el backend lo verifica. */
export function useActivationCode(onVerified: (activationCode: string) => void) {
  const [code, setCode] = useState('');
  const [error, setError] = useState<string>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const changeCode = useCallback((value: string) => {
    setCode(value);
    setError(undefined);
  }, []);

  /** El código dejó de servir después de verificarlo (p. ej. venció en el paso 2). */
  const markRejected = useCallback(() => setError(INVALID_CODE_MESSAGE), []);

  const submit = useCallback(async () => {
    const activationCode = normalizeActivationCode(code);
    if (!activationCode) {
      setError('Ingresa el código que te dio tu entrenador.');
      return;
    }

    setError(undefined);
    setIsSubmitting(true);
    try {
      await accountActivationService.verifyCode(activationCode);
      onVerified(activationCode);
    } catch (verifyError) {
      setError(
        isRejectedActivationCode(verifyError)
          ? INVALID_CODE_MESSAGE
          : CONNECTION_ERROR_MESSAGE,
      );
    } finally {
      setIsSubmitting(false);
    }
  }, [code, onVerified]);

  return { code, error, isSubmitting, changeCode, markRejected, submit };
}
