/**
 * Mail inbox opening state and action.
 *
 * @author Carlos
 * @packageDocumentation
 */

import { useCallback, useState } from 'react';
import { Linking, Platform } from 'react-native';
import { mailInboxUrls } from '@/utils/mail';

/**
 * Opens a client inbox through an installed mail app or the provider website.
 *
 * @param email - Address used to select likely inbox providers.
 * @returns A display-ready `error` and the `openMailApp` action.
 *
 * @example
 * ```tsx
 * const { error, openMailApp } = useMailApp(email);
 * ```
 */
export function useMailApp(email: string) {
  const [error, setError] = useState<string>();

  const openMailApp = useCallback(async () => {
    setError(undefined);
    // Try the next destination when an app is unavailable.
    for (const url of mailInboxUrls(email, Platform.OS)) {
      try {
        await Linking.openURL(url);
        return;
      } catch {
        continue;
      }
    }
    setError(
      'No pudimos abrir tu correo. Ábrelo y toca el enlace que te enviamos.',
    );
  }, [email]);

  return { error, openMailApp };
}
