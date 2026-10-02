/**
 * Deep link routes for password recovery.
 *
 * @author Carlos
 * @packageDocumentation
 */

import type { LinkingOptions } from '@react-navigation/native';
import { APP_LINK_PREFIXES } from '@/services/config';
import type { RootStackParamList } from '@/types/navigation';

/**
 * Maps the password-reset email link to its screen and token parameter.
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: APP_LINK_PREFIXES,
  config: {
    // Keep Welcome beneath the linked route so Back has a destination.
    initialRouteName: 'Welcome',
    screens: {
      ResetPassword: 'password-reset',
    },
  },
};
