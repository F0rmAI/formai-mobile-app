/** Texto de consentimiento que acepta el cliente y la versión que se envía al backend. */
export const DATA_CONSENT = {
  version: '1.0',
  text: 'Acepto el tratamiento de mis datos personales y de salud (peso, estatura y lesiones) para planificar mi entrenamiento.',
};

export const INVALID_CODE_MESSAGE =
  'Este código no es válido o ya venció. Pídele uno nuevo a tu entrenador.';

export const CONNECTION_ERROR_MESSAGE =
  'No pudimos conectarnos. Revisa tu conexión e inténtalo de nuevo.';

const EMAIL_PATTERN = /^\S+@\S+\.\S+$/;
const MIN_PASSWORD_LENGTH = 8;
const MAX_PASSWORD_LENGTH = 128;

/** El entrenador puede dictar el código con espacios o en minúsculas. */
export const normalizeActivationCode = (code: string) =>
  code.replace(/\s+/g, '').toUpperCase();

export const isValidEmail = (email: string) => EMAIL_PATTERN.test(email);

/** Mínimo 8 caracteres (máximo 128, límite del backend), con letras y números. */
export const isValidPassword = (password: string) =>
  password.length >= MIN_PASSWORD_LENGTH &&
  password.length <= MAX_PASSWORD_LENGTH &&
  /\p{L}/u.test(password) &&
  /\d/.test(password);
