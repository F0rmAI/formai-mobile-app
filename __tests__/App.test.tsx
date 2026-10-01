/**
 * @format
 */

import ReactTestRenderer from 'react-test-renderer';
import App from '@/App';

test('navega entre Hoy, Progreso y Perfil desde la barra inferior', async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });

  const tab = (label: string) =>
    renderer.root.findByProps({
      accessibilityRole: 'tab',
      accessibilityLabel: label,
    });
  const isSelected = (label: string) =>
    tab(label).props.accessibilityState.selected;

  expect(isSelected('Hoy')).toBe(true);
  expect(isSelected('Progreso')).toBe(false);
  expect(isSelected('Perfil')).toBe(false);

  await ReactTestRenderer.act(() => {
    tab('Progreso').props.onPress();
  });

  expect(isSelected('Hoy')).toBe(false);
  expect(isSelected('Progreso')).toBe(true);

  await ReactTestRenderer.act(() => {
    tab('Perfil').props.onPress();
  });

  expect(isSelected('Progreso')).toBe(false);
  expect(isSelected('Perfil')).toBe(true);

  // El navegador deja actualizaciones pendientes: se desmonta antes de terminar.
  await ReactTestRenderer.act(() => {
    renderer.unmount();
  });
});
