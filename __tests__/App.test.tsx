/**
 * Tests for the root component and the starter screen.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import ReactTestRenderer from 'react-test-renderer';
import App from '@/App';

describe('App', () => {
  it('renders the starter screen and increments the counter', async () => {
    let renderer!: ReactTestRenderer.ReactTestRenderer;
    await ReactTestRenderer.act(() => {
      renderer = ReactTestRenderer.create(<App />);
    });

    const counter = () =>
      renderer.root.findByProps({ testID: 'counter-value' });
    const button = renderer.root.findByProps({ accessibilityRole: 'button' });

    expect(counter().props.children).toBe(0);

    await ReactTestRenderer.act(() => {
      button.props.onPress();
    });

    expect(counter().props.children).toBe(1);
  });
});
