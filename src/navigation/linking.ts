import type { LinkingOptions } from '@react-navigation/native';
import { APP_LINK_PREFIXES } from '@/services/config';
import type { RootStackParamList } from '@/types/navigation';

/**
 * Enlaces que abren una pantalla de la app. El del correo de recuperación
 * (`…/password-reset?token=…`) abre "Nueva contraseña" con el token como parámetro.
 */
export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: APP_LINK_PREFIXES,
  config: {
    // La bienvenida queda debajo, para que "volver" tenga a dónde ir.
    initialRouteName: 'Welcome',
    screens: {
      ResetPassword: 'password-reset',
    },
  },
};
