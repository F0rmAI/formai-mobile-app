/**
 * @format
 */

import ReactTestRenderer from 'react-test-renderer';
import App from '@/App';

type Reply = { status: number; body?: unknown } | 'network-error';

const REFRESH = '/v1/authentication/refresh';
const SIGN_IN = '/v1/authentication/sign-in';
const SIGN_OUT = '/v1/authentication/sign-out';

const client = {
  id: 'ab5e59a7-851c-4b15-a2ea-6e3374e867a1',
  email: 'diego.paredes@correo.com',
  roles: ['REGISTERED_USER', 'CLIENT'],
  status: 'ACTIVE',
};

const fetchMock = jest.fn();

/** Responde cada endpoint con la respuesta indicada; sin sesión guardada por defecto. */
function mockBackend(replies: Record<string, Reply>) {
  const all: Record<string, Reply> = { [REFRESH]: { status: 401 }, ...replies };
  fetchMock.mockImplementation(async (url: string) => {
    const path = Object.keys(all).find(key => url.endsWith(key));
    const reply = path ? all[path] : { status: 404 };
    if (reply === 'network-error') {
      throw new TypeError('Network request failed');
    }
    return {
      ok: reply.status >= 200 && reply.status < 300,
      status: reply.status,
      headers: {
        get: () =>
          reply.body === undefined ? null : 'application/problem+json',
      },
      json: async () => reply.body,
    };
  });
}

const requestsTo = (path: string) =>
  fetchMock.mock.calls.filter(([url]) => (url as string).endsWith(path));

let renderer: ReactTestRenderer.ReactTestRenderer;

async function renderApp() {
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
}

const hasText = (text: string) =>
  renderer.root.findAll(node => node.props.children === text).length > 0;

/** Pulsa el último botón visible con ese texto (el de la pantalla superior). */
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

async function type(label: string, value: string) {
  const inputs = renderer.root.findAll(
    node =>
      node.props.accessibilityLabel === label &&
      typeof node.props.onChangeText === 'function',
  );
  await ReactTestRenderer.act(async () => {
    inputs[0].props.onChangeText(value);
  });
}

async function signInWith(email: string, password: string) {
  await press('Iniciar sesión');
  await type('Correo electrónico', email);
  await type('Contraseña', password);
  await press('Iniciar sesión');
}

const tab = (label: string) =>
  renderer.root.findByProps({
    accessibilityRole: 'tab',
    accessibilityLabel: label,
  });

const hasTabs = () =>
  renderer.root.findAllByProps({ accessibilityRole: 'tab' }).length > 0;

beforeEach(() => {
  fetchMock.mockReset();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

// El navegador deja actualizaciones pendientes: se desmonta antes de terminar.
afterEach(async () => {
  await ReactTestRenderer.act(async () => {
    renderer.unmount();
  });
});

test('sin sesión abre en la bienvenida con las opciones de ingreso', async () => {
  mockBackend({});
  await renderApp();

  expect(hasText('FormAI')).toBe(true);
  expect(hasText('Iniciar sesión')).toBe(true);
  expect(hasText('Activar mi cuenta')).toBe(true);
  expect(hasTabs()).toBe(false);
});

test('inicia sesión como cliente y entra a las pestañas', async () => {
  mockBackend({ [SIGN_IN]: { status: 200, body: client } });
  await renderApp();

  await signInWith(' diego.paredes@correo.com ', 'secreta123');

  const [, request] = requestsTo(SIGN_IN)[0];
  expect(request.credentials).toBe('include');
  expect(JSON.parse(request.body)).toEqual({
    email: 'diego.paredes@correo.com',
    password: 'secreta123',
    application: 'MOBILE_APP',
  });
  expect(tab('Hoy').props.accessibilityState.selected).toBe(true);
  expect(hasText('Activar mi cuenta')).toBe(false);
});

test('avisa cuando el correo o la contraseña son incorrectos', async () => {
  mockBackend({
    [SIGN_IN]: { status: 401, body: { detail: 'Invalid credentials' } },
  });
  await renderApp();

  await signInWith('diego.paredes@correo.com', 'incorrecta');

  expect(
    hasText('Correo o contraseña incorrectos. Inténtalo de nuevo.'),
  ).toBe(true);
  expect(hasTabs()).toBe(false);
});

test('no llama al backend si falta el correo o la contraseña', async () => {
  mockBackend({});
  await renderApp();
  await press('Iniciar sesión');

  await type('Correo electrónico', 'diego');
  await press('Iniciar sesión');
  expect(hasText('Ingresa un correo válido.')).toBe(true);

  await type('Correo electrónico', 'diego.paredes@correo.com');
  await press('Iniciar sesión');
  expect(hasText('Ingresa tu contraseña.')).toBe(true);

  expect(requestsTo(SIGN_IN)).toHaveLength(0);
});

test('avisa hasta qué hora está bloqueada la cuenta', async () => {
  const lockedUntil = new Date(2026, 9, 1, 18, 30).toISOString();
  mockBackend({ [SIGN_IN]: { status: 429, body: { lockedUntil } } });
  await renderApp();

  await signInWith('diego.paredes@correo.com', 'secreta123');

  expect(
    hasText(
      'Tu cuenta está bloqueada por intentos fallidos. Podrás intentarlo a las 18:30.',
    ),
  ).toBe(true);
});

test('avisa cuando la cuenta es de entrenador', async () => {
  mockBackend({ [SIGN_IN]: { status: 403, body: { status: 403 } } });
  await renderApp();

  await signInWith('entrenador@correo.com', 'secreta123');

  expect(
    hasText(
      'Esta cuenta no puede ingresar desde la app. Si eres entrenador, usa la web de FormAI.',
    ),
  ).toBe(true);
});

test('avisa cuando no hay conexión', async () => {
  mockBackend({ [SIGN_IN]: 'network-error' });
  await renderApp();

  await signInWith('diego.paredes@correo.com', 'secreta123');

  expect(
    hasText('No pudimos conectarnos. Revisa tu conexión e inténtalo de nuevo.'),
  ).toBe(true);
});

test('con una sesión guardada entra directo y navega entre pestañas', async () => {
  mockBackend({ [REFRESH]: { status: 200, body: client } });
  await renderApp();

  const isSelected = (label: string) =>
    tab(label).props.accessibilityState.selected;

  expect(hasText('Activar mi cuenta')).toBe(false);
  expect(isSelected('Hoy')).toBe(true);

  await ReactTestRenderer.act(async () => {
    tab('Progreso').props.onPress();
  });
  expect(isSelected('Hoy')).toBe(false);
  expect(isSelected('Progreso')).toBe(true);

  await ReactTestRenderer.act(async () => {
    tab('Perfil').props.onPress();
  });
  expect(isSelected('Progreso')).toBe(false);
  expect(isSelected('Perfil')).toBe(true);
});

async function openProfile() {
  await ReactTestRenderer.act(async () => {
    tab('Perfil').props.onPress();
  });
}

test('pide confirmación y cierra la sesión desde Perfil', async () => {
  mockBackend({
    [REFRESH]: { status: 200, body: client },
    [SIGN_OUT]: { status: 204 },
  });
  await renderApp();
  await openProfile();

  await press('Cerrar sesión');
  expect(hasText('¿Cerrar sesión?')).toBe(true);
  expect(requestsTo(SIGN_OUT)).toHaveLength(0);

  await press('Cerrar sesión');

  const [, request] = requestsTo(SIGN_OUT)[0];
  expect(request.method).toBe('POST');
  expect(request.credentials).toBe('include');
  expect(hasTabs()).toBe(false);
  expect(hasText('Activar mi cuenta')).toBe(true);
});

test('no cierra la sesión si se cancela la confirmación', async () => {
  mockBackend({ [REFRESH]: { status: 200, body: client } });
  await renderApp();
  await openProfile();

  await press('Cerrar sesión');
  await press('Cancelar');

  expect(hasText('¿Cerrar sesión?')).toBe(false);
  expect(requestsTo(SIGN_OUT)).toHaveLength(0);
  expect(hasTabs()).toBe(true);
});

test('mantiene la sesión y avisa si no se pudo cerrar', async () => {
  mockBackend({
    [REFRESH]: { status: 200, body: client },
    [SIGN_OUT]: 'network-error',
  });
  await renderApp();
  await openProfile();

  await press('Cerrar sesión');
  await press('Cerrar sesión');

  expect(hasText('No pudimos cerrar tu sesión. Inténtalo de nuevo.')).toBe(
    true,
  );
  expect(hasTabs()).toBe(true);
});
