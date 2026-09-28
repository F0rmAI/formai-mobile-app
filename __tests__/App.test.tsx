/**
 * @format
 */

import ReactTestRenderer from 'react-test-renderer';
import App from '@/App';

test('renderiza la pantalla inicial y el contador incrementa', async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });

  const counter = () => renderer.root.findByProps({ testID: 'counter-value' });
  const button = renderer.root.findByProps({ accessibilityRole: 'button' });

  expect(counter().props.children).toBe(0);

  await ReactTestRenderer.act(() => {
    button.props.onPress();
  });

  expect(counter().props.children).toBe(1);
});
