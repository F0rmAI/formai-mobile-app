/**
 * Integration tests for useForgotPassword, useResetPassword and useMailApp through the app.
 *
 * @author Carlos
 * @packageDocumentation
 */

import { Linking } from 'react-native';
import ReactTestRenderer from 'react-test-renderer';
import App from '@/App';
import { mailInboxUrls } from '@/utils/mail';

type Reply = { status: number; body?: unknown } | 'network-error';

const REQUEST = '/v1/password-reset-requests';
const RESET = '/v1/password-resets';
const RESET_LINK = 'https://formai.app/password-reset?token=tok-123';
const CONNECTION_ERROR =
  'No pudimos conectarnos. Revisa tu conexión e inténtalo de nuevo.';

const fetchMock = jest.fn();
const getInitialURL = Linking.getInitialURL as jest.Mock;
const openURL = Linking.openURL as jest.Mock;

/** Returns the configured response for each recovery endpoint. */
function mockBackend(replies: Record<string, Reply>) {
  fetchMock.mockImplementation(async (url: string) => {
    const path = Object.keys(replies).find(key => url.endsWith(key));
    const reply = path ? replies[path] : { status: 404 };
    if (reply === 'network-error') {
      throw new TypeError('Network request failed');
    }
    return {
      ok: reply.status >= 200 && reply.status < 300,
      status: reply.status,
      headers: {
        get: () => (reply.body === undefined ? null : 'application/json'),
      },
      json: async () => reply.body,
    };
  });
}

const requestsTo = (path: string) =>
  fetchMock.mock.calls.filter(([url]) => (url as string).endsWith(path));

const bodyOf = (path: string, index = 0) =>
  JSON.parse(requestsTo(path)[index][1].body);

let renderer: ReactTestRenderer.ReactTestRenderer;

/** Opens the app with an optional email deep link. */
async function renderApp(link?: string) {
  getInitialURL.mockResolvedValueOnce(link);
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
}

const hasText = (text: string) =>
  renderer.root.findAll(node => node.props.children === text).length > 0;

/** Presses the last visible button bearing the given label. */
async function press(label: string) {
  const buttons = renderer.root.findAll(
    node =>
      node.props.accessibilityRole === 'button' &&
      typeof node.props.onPress === 'function' &&
      node.findAll(child => child.props.children === label).length > 0,
  );
  await ReactTestRenderer.act(async () => {
    buttons[buttons.length - 1].props.onPress();
  });
}

/** Finds the last field bearing the given label. */
const input = (label: string) => {
  const inputs = renderer.root.findAll(
    node =>
      node.props.accessibilityLabel === label &&
      typeof node.props.onChangeText === 'function',
  );
  return inputs[inputs.length - 1];
};

async function type(label: string, value: string) {
  await ReactTestRenderer.act(async () => {
    input(label).props.onChangeText(value);
  });
}

async function openForgotPassword() {
  await press('Iniciar sesión');
  await press('¿Olvidaste tu contraseña?');
}

async function fillNewPassword(password = 'nueva1234', confirm = password) {
  await type('Nueva contraseña', password);
  await type('Confirmar contraseña', confirm);
}

beforeEach(() => {
  fetchMock.mockReset();
  openURL.mockReset();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

// Unmount the navigator before pending updates settle.
afterEach(async () => {
  await ReactTestRenderer.act(async () => {
    renderer.unmount();
  });
});

test('requests a reset link using the sign-in email', async () => {
  mockBackend({ [REQUEST]: { status: 201, body: { message: 'ok' } } });
  await renderApp();

  await press('Iniciar sesión');
  await type('Correo electrónico', ' diego.paredes@correo.com ');
  await press('¿Olvidaste tu contraseña?');

  expect(hasText('Recupera tu acceso')).toBe(true);
  expect(input('Correo electrónico').props.value).toBe(
    'diego.paredes@correo.com',
  );

  await press('Enviar enlace');

  expect(bodyOf(REQUEST)).toEqual({ email: 'diego.paredes@correo.com' });
  expect(hasText('Revisa tu correo')).toBe(true);
  expect(hasText('Te enviamos un nuevo enlace')).toBe(false);
});

test('does not call the backend for an invalid email', async () => {
  mockBackend({});
  await renderApp();
  await openForgotPassword();

  await type('Correo electrónico', 'diego');
  await press('Enviar enlace');

  expect(hasText('Ingresa un correo válido.')).toBe(true);
  expect(requestsTo(REQUEST)).toHaveLength(0);
});

test('shows a connection error while requesting a link', async () => {
  mockBackend({ [REQUEST]: 'network-error' });
  await renderApp();
  await openForgotPassword();

  await type('Correo electrónico', 'diego.paredes@correo.com');
  await press('Enviar enlace');

  expect(hasText(CONNECTION_ERROR)).toBe(true);
  expect(hasText('Revisa tu correo')).toBe(false);
});

test('opens the mail app and returns to sign-in', async () => {
  mockBackend({ [REQUEST]: { status: 201, body: { message: 'ok' } } });
  await renderApp();
  await openForgotPassword();
  await type('Correo electrónico', 'diego.paredes@correo.com');
  await press('Enviar enlace');

  await press('Abrir enlace del correo');
  expect(openURL).toHaveBeenCalledWith('message://');

  await press('Volver a iniciar sesión');
  expect(hasText('Hola de nuevo')).toBe(true);
  expect(hasText('Revisa tu correo')).toBe(false);
});

test('opens the provider website when mail apps are unavailable', async () => {
  mockBackend({ [REQUEST]: { status: 201, body: { message: 'ok' } } });
  // Fall back to the website when neither Outlook nor Mail is installed.
  openURL.mockImplementation(async (url: string) => {
    if (!url.startsWith('https://')) {
      throw new Error('No app');
    }
  });
  await renderApp();
  await openForgotPassword();
  await type('Correo electrónico', 'diego.paredes@outlook.com');
  await press('Enviar enlace');

  await press('Abrir enlace del correo');

  expect(openURL.mock.calls.map(([url]) => url)).toEqual([
    'ms-outlook://',
    'message://',
    'https://outlook.live.com/mail/',
  ]);
  expect(hasText('Revisa tu correo')).toBe(true);
});

test('shows an error when no inbox can be opened', async () => {
  mockBackend({ [REQUEST]: { status: 201, body: { message: 'ok' } } });
  openURL.mockRejectedValue(new Error('No app'));
  await renderApp();
  await openForgotPassword();
  await type('Correo electrónico', 'diego.paredes@correo.com');
  await press('Enviar enlace');

  await press('Abrir enlace del correo');

  expect(
    hasText(
      'No pudimos abrir tu correo. Ábrelo y toca el enlace que te enviamos.',
    ),
  ).toBe(true);
});

test('opens a reset link and saves the new password', async () => {
  mockBackend({ [RESET]: { status: 201, body: { message: 'ok' } } });
  await renderApp(RESET_LINK);

  expect(hasText('Crea una nueva contraseña')).toBe(true);

  await fillNewPassword();
  await press('Guardar contraseña');

  expect(bodyOf(RESET)).toEqual({ token: 'tok-123', password: 'nueva1234' });
  expect(hasText('Hola de nuevo')).toBe(true);
  expect(hasText('Ingresa con tu nueva contraseña.')).toBe(true);
  expect(hasText('Contraseña actualizada')).toBe(true);
  expect(hasText('Crea una nueva contraseña')).toBe(false);
});

test('opens a reset link using the custom app scheme', async () => {
  mockBackend({});
  await renderApp('formai://password-reset?token=tok-123');

  expect(hasText('Crea una nueva contraseña')).toBe(true);
});

test('validates password and confirmation before saving', async () => {
  mockBackend({});
  await renderApp(RESET_LINK);

  await fillNewPassword('corta1');
  await press('Guardar contraseña');
  expect(
    hasText(
      'La contraseña debe tener mínimo 8 caracteres, con letras y números.',
    ),
  ).toBe(true);

  await fillNewPassword('nueva1234', 'nueva1235');
  await press('Guardar contraseña');
  expect(hasText('Las contraseñas no coinciden.')).toBe(true);

  expect(requestsTo(RESET)).toHaveLength(0);
});

test('requests a new link after an expired link is rejected', async () => {
  mockBackend({
    [RESET]: { status: 422, body: { status: 422 } },
    [REQUEST]: { status: 201, body: { message: 'ok' } },
  });
  await renderApp(RESET_LINK);

  await fillNewPassword();
  await press('Guardar contraseña');

  expect(hasText('Este enlace ya no es válido')).toBe(true);
  expect(hasText('Crea una nueva contraseña')).toBe(false);

  await press('Solicitar un nuevo enlace');
  expect(hasText('Recupera tu acceso')).toBe(true);

  await type('Correo electrónico', 'diego.paredes@correo.com');
  await press('Enviar enlace');

  expect(hasText('Revisa tu correo')).toBe(true);
  expect(hasText('Te enviamos un nuevo enlace')).toBe(true);
});

test('rejects a link without a token', async () => {
  mockBackend({});
  await renderApp('https://formai.app/password-reset');

  expect(hasText('Este enlace ya no es válido')).toBe(true);
  expect(requestsTo(RESET)).toHaveLength(0);
});

test('invalidates an open reset screen when the new link lacks a token', async () => {
  mockBackend({});
  await renderApp(RESET_LINK);

  const listeners = (Linking.addEventListener as jest.Mock).mock.calls
    .filter(([event]) => event === 'url')
    .map(([, listener]) => listener);
  await ReactTestRenderer.act(async () => {
    listeners[listeners.length - 1]({ url: 'formai://password-reset' });
  });

  expect(hasText('Este enlace ya no es válido')).toBe(true);
});

test('shows a connection error while saving the new password', async () => {
  mockBackend({ [RESET]: 'network-error' });
  await renderApp(RESET_LINK);

  await fillNewPassword();
  await press('Guardar contraseña');

  expect(hasText('Crea una nueva contraseña')).toBe(true);
  expect(hasText(CONNECTION_ERROR)).toBe(true);
});

test('prefills the email when the link was requested in the app', async () => {
  mockBackend({
    [REQUEST]: { status: 201, body: { message: 'ok' } },
    [RESET]: { status: 201, body: { message: 'ok' } },
  });
  await renderApp();
  await openForgotPassword();
  await type('Correo electrónico', 'diego.paredes@correo.com');
  await press('Enviar enlace');

  // The client follows the email link while the app is open.
  const listeners = (Linking.addEventListener as jest.Mock).mock.calls
    .filter(([event]) => event === 'url')
    .map(([, listener]) => listener);
  await ReactTestRenderer.act(async () => {
    listeners[listeners.length - 1]({ url: RESET_LINK });
  });
  expect(hasText('Crea una nueva contraseña')).toBe(true);

  await fillNewPassword();
  await press('Guardar contraseña');

  expect(hasText('Contraseña actualizada')).toBe(true);
  expect(input('Correo electrónico').props.value).toBe(
    'diego.paredes@correo.com',
  );
});

test('selects inbox destinations by provider and platform', () => {
  expect(mailInboxUrls(' Diego@Gmail.com ', 'ios')).toEqual([
    'googlegmail://',
    'message://',
    'https://mail.google.com/',
  ]);
  expect(mailInboxUrls('diego@gmail.com', 'android')).toEqual([
    'https://mail.google.com/',
    'mailto:',
  ]);
  expect(mailInboxUrls('diego@correo.com', 'android')).toEqual(['mailto:']);
});
