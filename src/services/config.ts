import { Platform } from 'react-native';

/**
 * URL base del backend (Spring Boot detrás de Caddy en `/api`).
 * React Native no lee `.env` sin una librería adicional: ajusta los valores aquí.
 * En el emulador de Android, `10.0.2.2` apunta al localhost de tu máquina.
 */
const DEV_API_URL = Platform.select({
  android: 'http://10.0.2.2:8080/api',
  default: 'http://localhost:8080/api',
});

const PROD_API_URL = 'https://formai.app/api';

export const API_URL = __DEV__ ? DEV_API_URL : PROD_API_URL;

/**
 * Prefijos de los enlaces que abren la app. El correo de recuperación apunta a
 * `PASSWORD_RESET_URL` del backend: en producción, `https://formai.app/password-reset?token=`.
 * `formai://` sirve para abrir la app en desarrollo, donde ese enlace apunta a la web local.
 */
export const APP_LINK_PREFIXES = ['formai://', 'https://formai.app'];
