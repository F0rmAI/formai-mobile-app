/**
 * Tests for the counter hook.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import ReactTestRenderer from 'react-test-renderer';
import { useCounter } from '@/hooks/useCounter';

type Counter = ReturnType<typeof useCounter>;

/** Renders the hook inside a host component and returns a getter for its latest value. */
async function renderCounter(initialValue?: number) {
  let current!: Counter;
  function Host() {
    current = useCounter(initialValue);
    return null;
  }
  await ReactTestRenderer.act(() => {
    ReactTestRenderer.create(<Host />);
  });
  return () => current;
}

describe('useCounter', () => {
  it('starts at zero by default', async () => {
    const counter = await renderCounter();

    expect(counter().count).toBe(0);
  });

  it('adds one on increment', async () => {
    const counter = await renderCounter(5);

    await ReactTestRenderer.act(() => counter().increment());

    expect(counter().count).toBe(6);
  });

  it('goes back to the initial value on reset', async () => {
    const counter = await renderCounter(2);

    await ReactTestRenderer.act(() => counter().increment());
    await ReactTestRenderer.act(() => counter().reset());

    expect(counter().count).toBe(2);
  });
});
