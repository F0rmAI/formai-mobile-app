/**
 * @format
 */

import ReactTestRenderer from 'react-test-renderer';
import App from '@/App';
import {
  isValidPassword,
  normalizeActivationCode,
} from '@/utils/account-activation';

type Reply = { status: number; body?: unknown } | 'network-error';

const VERIFY = '/v1/activation-code-verifications';
const ACTIVATE = '/v1/account-activations';
const INVALID_CODE =
  'Este código no es válido o ya venció. Pídele uno nuevo a tu entrenador.';

const fetchMock = jest.fn();

/** Responde cada endpoint de activación con la respuesta indicada. */
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

const bodyOf = (path: string) => JSON.parse(requestsTo(path)[0][1].body);

let renderer: ReactTestRenderer.ReactTestRenderer;

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

const input = (label: string) =>
  renderer.root.findAll(
    node =>
      node.props.accessibilityLabel === label &&
      typeof node.props.onChangeText === 'function',
  )[0];

async function type(label: string, value: string) {
  await ReactTestRenderer.act(async () => {
    input(label).props.onChangeText(value);
  });
}

async function acceptConsent() {
  const checkbox = renderer.root.findAll(
    node =>
      node.props.accessibilityRole === 'checkbox' &&
      typeof node.props.onPress === 'function',
  )[0];
  await ReactTestRenderer.act(async () => {
    checkbox.props.onPress();
  });
}

/** Llega a "Crea tu contraseña" con un código que el backend acepta. */
async function reachPasswordStep() {
  await press('Activar mi cuenta');
  await type('Código de activación', 'ABCD2345');
  await press('Continuar');
}

async function fillPasswordStep({ consent = true } = {}) {
  await type('Correo de tu cuenta', ' diego.paredes@correo.com ');
  await type('Contraseña', 'secreta123');
  await type('Confirmar contraseña', 'secreta123');
  if (consent) {
    await acceptConsent();
  }
}

beforeEach(async () => {
  fetchMock.mockReset();
  globalThis.fetch = fetchMock as unknown as typeof fetch;
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<App />);
  });
});

// El navegador deja actualizaciones pendientes: se desmonta antes de terminar.
afterEach(async () => {
  await ReactTestRenderer.act(async () => {
    renderer.unmount();
  });
});

test('verifica el código y pasa a crear la contraseña', async () => {
  mockBackend({ [VERIFY]: { status: 201, body: { expiresAt: '2026-10-04' } } });

  await press('Activar mi cuenta');
  expect(hasText('Ingresa tu código')).toBe(true);

  await type('Código de activación', ' abcd 2345 ');
  await press('Continuar');

  expect(bodyOf(VERIFY)).toEqual({ activationCode: 'ABCD2345' });
  expect(hasText('Crea tu contraseña')).toBe(true);
});

test('avisa cuando el código no es válido o venció', async () => {
  mockBackend({ [VERIFY]: { status: 422, body: { status: 422 } } });

  await press('Activar mi cuenta');
  await type('Código de activación', 'ZZZZ9999');
  await press('Continuar');

  expect(hasText(INVALID_CODE)).toBe(true);
  expect(hasText('Crea tu contraseña')).toBe(false);
});

test('no llama al backend si el código está vacío', async () => {
  await press('Activar mi cuenta');
  await press('Continuar');

  expect(hasText('Ingresa el código que te dio tu entrenador.')).toBe(true);
  expect(requestsTo(VERIFY)).toHaveLength(0);
});

test('avisa cuando no hay conexión al verificar el código', async () => {
  mockBackend({ [VERIFY]: 'network-error' });

  await press('Activar mi cuenta');
  await type('Código de activación', 'ABCD2345');
  await press('Continuar');

  expect(
    hasText('No pudimos conectarnos. Revisa tu conexión e inténtalo de nuevo.'),
  ).toBe(true);
});

test('exige aceptar el consentimiento antes de activar', async () => {
  mockBackend({ [VERIFY]: { status: 201, body: { expiresAt: '2026-10-04' } } });
  await reachPasswordStep();

  await fillPasswordStep({ consent: false });
  await press('Activar cuenta');

  expect(
    hasText(
      'Debes aceptar el tratamiento de tus datos para activar tu cuenta.',
    ),
  ).toBe(true);
  expect(requestsTo(ACTIVATE)).toHaveLength(0);
});

test('valida correo, contraseña y confirmación antes de activar', async () => {
  mockBackend({ [VERIFY]: { status: 201, body: { expiresAt: '2026-10-04' } } });
  await reachPasswordStep();

  await type('Correo de tu cuenta', 'diego');
  await type('Contraseña', 'corta1');
  await acceptConsent();
  await press('Activar cuenta');

  expect(hasText('Ingresa un correo válido.')).toBe(true);
  expect(
    hasText(
      'La contraseña debe tener mínimo 8 caracteres, con letras y números.',
    ),
  ).toBe(true);

  await type('Contraseña', 'secreta123');
  await type('Confirmar contraseña', 'secreta124');
  await press('Activar cuenta');

  expect(hasText('Las contraseñas no coinciden.')).toBe(true);
  expect(requestsTo(ACTIVATE)).toHaveLength(0);
});

test('activa la cuenta y lleva al inicio de sesión con el correo', async () => {
  mockBackend({
    [VERIFY]: { status: 201, body: { expiresAt: '2026-10-04' } },
    [ACTIVATE]: { status: 201, body: { userId: 'u1', status: 'ACTIVE' } },
  });
  await reachPasswordStep();

  await fillPasswordStep();
  await press('Activar cuenta');

  expect(bodyOf(ACTIVATE)).toEqual({
    activationCode: 'ABCD2345',
    email: 'diego.paredes@correo.com',
    password: 'secreta123',
    consentAccepted: true,
    consentVersion: '1.0',
  });
  expect(hasText('Hola de nuevo')).toBe(true);
  expect(hasText('Cuenta activada')).toBe(true);
  expect(input('Correo electrónico').props.value).toBe(
    'diego.paredes@correo.com',
  );
});

test('vuelve al código si deja de ser válido al activar', async () => {
  mockBackend({
    [VERIFY]: { status: 201, body: { expiresAt: '2026-10-04' } },
    [ACTIVATE]: { status: 422, body: { status: 422 } },
  });
  await reachPasswordStep();

  await fillPasswordStep();
  await press('Activar cuenta');

  expect(hasText('Ingresa tu código')).toBe(true);
  expect(hasText(INVALID_CODE)).toBe(true);
});

test('avisa cuando el correo ya pertenece a otra cuenta', async () => {
  mockBackend({
    [VERIFY]: { status: 201, body: { expiresAt: '2026-10-04' } },
    [ACTIVATE]: { status: 409, body: { status: 409 } },
  });
  await reachPasswordStep();

  await fillPasswordStep();
  await press('Activar cuenta');

  expect(hasText('Crea tu contraseña')).toBe(true);
  expect(
    hasText('Este correo ya está registrado. Usa otro o inicia sesión.'),
  ).toBe(true);
});

test('avisa cuando el backend no acepta el formato del correo', async () => {
  mockBackend({
    [VERIFY]: { status: 201, body: { expiresAt: '2026-10-04' } },
    [ACTIVATE]: { status: 400, body: { status: 400 } },
  });
  await reachPasswordStep();

  await fillPasswordStep();
  await press('Activar cuenta');

  expect(hasText('Crea tu contraseña')).toBe(true);
  expect(hasText('Ingresa un correo válido.')).toBe(true);
});

test('avisa cuando no hay conexión al activar', async () => {
  mockBackend({
    [VERIFY]: { status: 201, body: { expiresAt: '2026-10-04' } },
    [ACTIVATE]: 'network-error',
  });
  await reachPasswordStep();

  await fillPasswordStep();
  await press('Activar cuenta');

  expect(hasText('Crea tu contraseña')).toBe(true);
  expect(
    hasText('No pudimos conectarnos. Revisa tu conexión e inténtalo de nuevo.'),
  ).toBe(true);
});

test('normaliza el código y aplica la política de contraseña', () => {
  expect(normalizeActivationCode(' abcd 2345 ')).toBe('ABCD2345');
  expect(isValidPassword('secreta123')).toBe(true);
  expect(isValidPassword('corta1')).toBe(false);
  expect(isValidPassword('sololetras')).toBe(false);
  expect(isValidPassword('12345678')).toBe(false);
  expect(isValidPassword(`a1${'x'.repeat(127)}`)).toBe(false);
});
