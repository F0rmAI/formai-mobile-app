import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { firstNameOf } from '@/utils/names';

/**
 * Nombre del cliente con sesión iniciada, listo para pintar. Todo queda sin
 * definir mientras el perfil carga o si no se pudo obtener.
 */
export function useClientProfile() {
  const { profile } = useAuth();

  return useMemo(
    () => ({
      firstName: profile ? firstNameOf(profile.fullName) : undefined,
      /** Datos para el avatar del encabezado. */
      headerUser: profile ? { name: profile.fullName } : undefined,
    }),
    [profile],
  );
}
