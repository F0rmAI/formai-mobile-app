/**
 * Environment configuration of the services layer.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { API_URL as envApiUrl } from '@env';
import { Platform } from 'react-native';

// On the Android emulator, `10.0.2.2` points to the localhost of the host machine.
const DEV_API_URL = Platform.select({
  android: 'http://10.0.2.2:8080/api/v1',
  default: 'http://localhost:8080/api/v1',
});

const configuredApiUrl = envApiUrl?.trim().replace(/\/+$/, '');

if (!__DEV__ && !configuredApiUrl) {
  throw new Error('API_URL is required for release builds.');
}

/**
 * Base URL of the backend, without a trailing slash.
 */
export const API_URL =
  configuredApiUrl || DEV_API_URL;

/**
 * URL prefixes accepted for app deep links.
 * The backend password-reset URL targets the production HTTPS route.
 * The custom scheme opens the app during local development.
 */
export const APP_LINK_PREFIXES = ['formai://', 'https://formai.app'];
