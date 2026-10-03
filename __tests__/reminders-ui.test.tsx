/**
 * UI smoke tests for reminder settings card states.
 *
 * @author Christian
 * @packageDocumentation
 */

import ReactTestRenderer from 'react-test-renderer';
import { ReminderSettingsCard } from '@/components/reminders';

const hasText = (root: ReactTestRenderer.ReactTestInstance, text: string) =>
  root.findAll(node => node.props.children === text).length > 0;

test('hides the time field when reminders are off', () => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <ReminderSettingsCard
        enabled={false}
        timeLabel="7:00 a. m."
        onEnabledChange={() => undefined}
        onPressTime={() => undefined}
      />,
    );
  });
  expect(hasText(tree.root, 'Desactivados · no recibirás avisos')).toBe(true);
  expect(hasText(tree.root, 'Hora del aviso')).toBe(false);
});

test('shows the time field when reminders are on', () => {
  let tree!: ReactTestRenderer.ReactTestRenderer;
  ReactTestRenderer.act(() => {
    tree = ReactTestRenderer.create(
      <ReminderSettingsCard
        enabled
        timeLabel="7:00 a. m."
        onEnabledChange={() => undefined}
        onPressTime={() => undefined}
      />,
    );
  });
  expect(hasText(tree.root, 'Activados')).toBe(true);
  expect(hasText(tree.root, 'Hora del aviso')).toBe(true);
  expect(hasText(tree.root, '7:00 a. m.')).toBe(true);
});
