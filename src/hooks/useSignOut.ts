/**
 * Confirmed sign-out state and actions.
 *
 * @author Carlos
 * @packageDocumentation
 */

import { useCallback, useState } from 'react';
import { useAuth } from '@/context/AuthContext';

/**
 * Manages sign-out confirmation and request state.
 *
 * @returns Confirmation and submission state, display-ready `error` and actions.
 *
 * @example
 * ```tsx
 * const { requestSignOut, confirm, cancel } = useSignOut();
 * ```
 */
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
      // The navigator replaces the tabs with Welcome after sign-out.
      await signOut();
    } catch {
      setError('No pudimos cerrar tu sesión. Inténtalo de nuevo.');
      setIsSigningOut(false);
    }
  }, [signOut]);

  return { isConfirming, isSigningOut, error, requestSignOut, cancel, confirm };
}
