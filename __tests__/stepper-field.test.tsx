/**
 * Training stepper value and decimal submission regression tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import ReactTestRenderer from 'react-test-renderer';
import { TextInput } from 'react-native';
import { StepperField } from '@/components/ui';
import { SetEditor } from '@/components/training/SetEditor';
import type { WorkoutExercise } from '@/types/training';

const exercise: WorkoutExercise = {
  exerciseId: 'e1',
  exerciseName: 'Press',
  targetSets: 1,
  targetReps: 16,
  targetLoadKg: 22.5,
  sets: [],
};

let renderer: ReactTestRenderer.ReactTestRenderer;

afterEach(async () => {
  if (renderer) {
    await ReactTestRenderer.act(async () => renderer.unmount());
  }
});

test('sizes a decimal value from its text and preserves typed decimals', async () => {
  const onChange = jest.fn();
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <StepperField
        label="Carga"
        value="22.5"
        suffix="kg"
        step={0.5}
        onChange={onChange}
      />,
    );
  });
  const measure = renderer.root.find(
    node => node.props.accessible === false && node.props.children === '22.5',
  );
  await ReactTestRenderer.act(async () => {
    measure.props.onLayout({ nativeEvent: { layout: { width: 48 } } });
  });
  const input = renderer.root.findByType(TextInput);
  expect(input.props.value).toBe('22.5');
  expect(input.props.style.width).toBe(58);
  expect(input.props.className).toContain('text-center');
  input.props.onChangeText('22,5');
  expect(onChange).toHaveBeenCalledWith('22,5');
  await ReactTestRenderer.act(async () => {
    renderer.update(
      <StepperField
        label="Carga"
        value="122.5"
        suffix="kg"
        step={0.5}
        onChange={onChange}
      />,
    );
  });
  const longValueMeasure = renderer.root.find(
    node => node.props.accessible === false && node.props.children === '122.5',
  );
  await ReactTestRenderer.act(async () => {
    longValueMeasure.props.onLayout({ nativeEvent: { layout: { width: 57 } } });
  });
  expect(renderer.root.findByType(TextInput).props.style.width).toBe(67);
});

test('submits a decimal load as a number', async () => {
  const onSave = jest.fn().mockResolvedValue(true);
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <SetEditor
        exercise={exercise}
        setNumber={1}
        saving={false}
        onSave={onSave}
      />,
    );
  });
  const loadInput = renderer.root.findAllByType(TextInput).find(
    input => input.props.accessibilityLabel === 'Carga',
  );
  await ReactTestRenderer.act(async () => {
    loadInput?.props.onChangeText('22,5');
  });
  const save = renderer.root.find(
    node =>
      node.props.accessibilityLabel === 'Registrar serie 1' &&
      typeof node.props.onPress === 'function',
  );
  await ReactTestRenderer.act(async () => {
    await save.props.onPress();
  });
  expect(onSave).toHaveBeenCalledWith({
    exerciseId: 'e1',
    setNumber: 1,
    loadKg: 22.5,
    reps: 16,
  });
});
