import { useCallback, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

/** Cierre de sesión con confirmación previa. */
export function useSignOut() {
  const { signOut } = useAuth();
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string>();

  const requestSignOut = useCallback(() => {
    setError(undefined);
    setIsConfirming(true);
  }, []);

  const cancel = useCallback(() => setIsConfirming(false), []);

  const confirm = useCallback(async () => {
    setIsConfirming(false);
    setIsSigningOut(true);
    try {
      // Al cerrar la sesión, el navegador reemplaza las pestañas por la bienvenida.
      await signOut();
    } catch {
      setError('No pudimos cerrar tu sesión. Inténtalo de nuevo.');
      setIsSigningOut(false);
    }
  }, [signOut]);

  return { isConfirming, isSigningOut, error, requestSignOut, cancel, confirm };
}
