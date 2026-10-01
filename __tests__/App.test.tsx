/**
 * @format
 */

import ReactTestRenderer from 'react-test-renderer';
import App from '@/App';

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

const tab = (label: string) =>
  renderer.root.findByProps({
    accessibilityRole: 'tab',
    accessibilityLabel: label,
  });

beforeEach(async () => {
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

test('abre en la bienvenida con las opciones de ingreso', () => {
  expect(hasText('FormAI')).toBe(true);
  expect(hasText('Iniciar sesión')).toBe(true);
  expect(hasText('Activar mi cuenta')).toBe(true);
});

test('lleva de la bienvenida a la pantalla de inicio de sesión', async () => {
  await press('Iniciar sesión');

  expect(hasText('Hola de nuevo')).toBe(true);
  expect(
    renderer.root.findAllByProps({ accessibilityLabel: 'Correo electrónico' })
      .length,
  ).toBeGreaterThan(0);
});

test('navega entre Hoy, Progreso y Perfil desde la barra inferior', async () => {
  await press('Iniciar sesión');
  await press('Iniciar sesión');

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
