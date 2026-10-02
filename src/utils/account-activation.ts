/**
 * account-activation module.
 *
 * @author Carlos
 * @packageDocumentation
 */

/** Consent copy and version sent to the backend. */
export const DATA_CONSENT = {
  version: '1.0',
  text: 'Acepto el tratamiento de mis datos personales y de salud (peso, estatura y lesiones) para planificar mi entrenamiento.',
};

/** Message for a rejected activation code. */
export const INVALID_CODE_MESSAGE =
  'Este código no es válido o ya venció. Pídele uno nuevo a tu entrenador.';

/** Shared message for email conflicts and incorrect existing-account passwords. */
export const ACTIVATION_CONFLICT_MESSAGE =
  'No pudimos activar la cuenta con esos datos. Si ya tienes una cuenta, usa tu correo y tu contraseña actual; de lo contrario, revisa el correo o usa uno distinto.';

/** Message for invalid email input. */
export const INVALID_EMAIL_MESSAGE = 'Ingresa un correo válido.';

/** Message for connectivity failures. */
export const CONNECTION_ERROR_MESSAGE =
  'No pudimos conectarnos. Revisa tu conexión e inténtalo de nuevo.';

// Same email format accepted by the backend.
const EMAIL_PATTERN = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

/** Normalizes a code dictated with spaces or lowercase letters. */
export const normalizeActivationCode = (code: string) =>
  code.replace(/\s+/g, '').toUpperCase();

/** Checks basic email syntax before submission. */
export const isValidEmail = (email: string) => EMAIL_PATTERN.test(email);

/** Accepts the backend password range, including existing account passwords. */
export const isValidPassword = (password: string) =>
  password.length >= MIN_PASSWORD_LENGTH &&
  password.length <= MAX_PASSWORD_LENGTH;
