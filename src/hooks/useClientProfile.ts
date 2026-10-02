/**
 * Client profile presentation hook.
 *
 * @author Carlos
 * @packageDocumentation
 */

import { useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { firstNameOf } from '@/utils/names';

/**
 * Provides the signed-in client profile and display name when available.
 */
export function useClientProfile() {
  const { profile } = useAuth();

  return useMemo(
    () => ({
      profile,
      firstName: profile ? firstNameOf(profile.fullName) : undefined,
      /** Avatar data for the header. */
      headerUser: profile ? { name: profile.fullName } : undefined,
    }),
    [profile],
  );
}
