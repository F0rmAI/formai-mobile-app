import { useCallback, useState } from 'react';
import { Linking, Platform } from 'react-native';
import { mailInboxUrls } from '@/utils/mail';

/** Abre el correo del cliente, donde recibe el enlace: su app de correo o la bandeja web. */
export function useMailApp(email: string) {
  const [error, setError] = useState<string>();

  const openMailApp = useCallback(async () => {
    setError(undefined);
    // `openURL` falla si la app no está instalada: se prueba la siguiente opción.
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
