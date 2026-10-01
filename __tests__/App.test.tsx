/**
 * @format
 */

import ReactTestRenderer from 'react-test-renderer';
import App from '@/App';

type Reply = { status: number; body?: unknown };

const client = {
  id: 'ab5e59a7-851c-4b15-a2ea-6e3374e867a1',
  email: 'diego.paredes@correo.com',
  roles: ['REGISTERED_USER', 'CLIENT'],
  status: 'ACTIVE',
};

const fetchMock = jest.fn();

/** Responde cada endpoint de autenticación con la respuesta indicada. */
function mockBackend(replies: Record<string, Reply>) {
  fetchMock.mockImplementation(async (url: string) => {
    const path = Object.keys(replies).find(key => url.endsWith(key));
    const { status, body } = path ? replies[path] : { status: 404 };
    return {
      ok: status >= 200 && status < 300,
      status,
      headers: {
        get: () => (body === undefined ? null : 'application/json'),
      },
      json: async () => body,
    };
  });
}

const requestTo = (path: string) =>
  fetchMock.mock.calls.find(([url]) => (url as string).endsWith(path));

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

const tab = (label: string) =>
  renderer.root.findByProps({
    accessibilityRole: 'tab',
    accessibilityLabel: label,
  });

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

test('sin sesión muestra la bienvenida y permite iniciar sesión', async () => {
  mockBackend({
    '/authentication/refresh': { status: 401 },
    '/authentication/sign-in': { status: 200, body: client },
  });
  await renderApp();

  expect(hasText('Activar mi cuenta')).toBe(true);

  await press('Iniciar sesión');
  expect(hasText('Hola de nuevo')).toBe(true);

  await type('Correo electrónico', ' diego.paredes@correo.com ');
  await type('Contraseña', 'secreta123');
  await press('Iniciar sesión');

  const [, request] = requestTo('/authentication/sign-in')!;
  expect(request.credentials).toBe('include');
  expect(JSON.parse(request.body)).toEqual({
    email: 'diego.paredes@correo.com',
    password: 'secreta123',
    application: 'MOBILE_APP',
  });
  expect(tab('Hoy').props.accessibilityState.selected).toBe(true);
});

test('avisa cuando el correo o la contraseña son incorrectos', async () => {
  mockBackend({
    '/authentication/refresh': { status: 401 },
    '/authentication/sign-in': {
      status: 401,
      body: { status: 401, detail: 'Invalid credentials' },
    },
  });
  await renderApp();
  await press('Iniciar sesión');

  await type('Correo electrónico', 'diego.paredes@correo.com');
  await type('Contraseña', 'incorrecta');
  await press('Iniciar sesión');

  expect(
    hasText('Correo o contraseña incorrectos. Inténtalo de nuevo.'),
  ).toBe(true);
});

test('no llama al backend si el correo no es válido', async () => {
  mockBackend({ '/authentication/refresh': { status: 401 } });
  await renderApp();
  await press('Iniciar sesión');

  await type('Correo electrónico', 'diego');
  await press('Iniciar sesión');

  expect(hasText('Ingresa un correo válido.')).toBe(true);
  expect(requestTo('/authentication/sign-in')).toBeUndefined();
});

test('con sesión navega entre Hoy, Progreso y Perfil', async () => {
  mockBackend({ '/authentication/refresh': { status: 200, body: client } });
  await renderApp();

  const isSelected = (label: string) =>
    tab(label).props.accessibilityState.selected;

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

test('cierra la sesión desde Perfil después de confirmar', async () => {
  mockBackend({
    '/authentication/refresh': { status: 200, body: client },
    '/authentication/sign-out': { status: 204 },
  });
  await renderApp();
  await ReactTestRenderer.act(async () => {
    tab('Perfil').props.onPress();
  });

  await press('Cerrar sesión');
  expect(hasText('¿Cerrar sesión?')).toBe(true);
  expect(requestTo('/authentication/sign-out')).toBeUndefined();

  await press('Cerrar sesión');

  expect(requestTo('/authentication/sign-out')).toBeDefined();
  expect(hasText('Activar mi cuenta')).toBe(true);
});
