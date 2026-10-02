/**
 * Environment configuration of the services layer.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Platform } from 'react-native';

// React Native does not read `.env` files without an extra library, so the values live here.
// On the Android emulator, `10.0.2.2` points to the localhost of the host machine.
const DEV_API_URL = Platform.select({
  android: 'http://10.0.2.2:8080/api',
  default: 'http://localhost:8080/api',
});

const PROD_API_URL = 'https://formai.app/api';

/**
 * Base URL of the backend, without a trailing slash.
 */
export const API_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

/**
 * Prefijos de los enlaces que abren la app. El correo de recuperación apunta a
 * `PASSWORD_RESET_URL` del backend: en producción, `https://formai.app/password-reset?token=`.
 * `formai://` sirve para abrir la app en desarrollo, donde ese enlace apunta a la web local.
 */
export const APP_LINK_PREFIXES = ['formai://', 'https://formai.app'];
