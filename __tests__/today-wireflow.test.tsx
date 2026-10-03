/**
 * Today's workout card and completion flow regression tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import ReactTestRenderer from 'react-test-renderer';
import { useClientProfile } from '@/hooks/useClientProfile';
import { useTraining } from '@/hooks/useTraining';
import { TodayScreen } from '@/screens/TodayScreen';
import type { ActiveRoutine, WorkoutSession } from '@/types/training';

jest.mock('@/hooks/useClientProfile', () => ({ useClientProfile: jest.fn() }));
jest.mock('@/hooks/useTraining', () => ({ useTraining: jest.fn() }));

const routine: ActiveRoutine = {
  routineId: 'r1',
  routineName: 'Fuerza',
  version: 1,
  startDate: '2026-10-01',
  trainingDays: ['FRIDAY'],
  todaySessionOrder: 1,
  todayWorkoutSessionId: 's1',
  sessions: [
    {
      order: 1,
      label: 'Día A',
      exercises: [
        {
          exerciseId: 'e1',
          exerciseName: 'Press',
          sets: 2,
          reps: 10,
          targetLoadKg: 20,
          restSeconds: 90,
        },
        {
          exerciseId: 'e2',
          exerciseName: 'Remo',
          sets: 1,
          reps: 8,
          targetLoadKg: 30,
          restSeconds: 60,
        },
      ],
    },
  ],
};

const session: WorkoutSession = {
  id: 's1',
  scheduledFor: '2026-10-02',
  dayLabel: 'Día A',
  routineVersion: 1,
  status: 'PENDING',
  totalVolumeKg: 200,
  finishedAt: null,
  exercises: [
    {
      exerciseId: 'e1',
      exerciseName: 'Press',
      targetSets: 2,
      targetReps: 10,
      targetLoadKg: 20,
      sets: [
        {
          setNumber: 1,
          loadKg: 20,
          reps: 10,
          recordedAt: '2026-10-02T10:00:00Z',
        },
      ],
    },
    {
      exerciseId: 'e2',
      exerciseName: 'Remo',
      targetSets: 1,
      targetReps: 8,
      targetLoadKg: 30,
      sets: [],
    },
  ],
};

const recordSet = jest.fn().mockResolvedValue(true);
const correctSet = jest.fn().mockResolvedValue(true);
const finishSession = jest.fn().mockResolvedValue(undefined);
let tree: ReactTestRenderer.ReactTestRenderer;

function hasText(value: string) {
  return JSON.stringify(tree.toJSON()).includes(value);
}

async function press(label: string) {
  const button = tree.root.findAll(
    node =>
      node.props.accessibilityLabel === label &&
      typeof node.props.onPress === 'function',
  )[0];
  expect(button).toBeDefined();
  await ReactTestRenderer.act(async () => button.props.onPress());
}

beforeEach(() => {
  jest.mocked(useClientProfile).mockReturnValue({
    firstName: 'Diego',
    headerUser: undefined,
  } as ReturnType<typeof useClientProfile>);
  jest.mocked(useTraining).mockReturnValue({
    routine,
    session,
    summary: { session, completedSets: 1, targetSets: 3, isPartial: true },
    isLoading: false,
    saving: false,
    error: undefined,
    retry: jest.fn(),
    recordSet,
    correctSet,
    finishSession,
  });
});

afterEach(async () => {
  if (tree) await ReactTestRenderer.act(async () => tree.unmount());
  jest.clearAllMocks();
});

test('shows status, real rest values, pending series and the partial confirmation', async () => {
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <TodayScreen navigation={{ getParent: () => undefined } as never} />,
    );
  });
  expect(hasText('Ejercicio actual')).toBe(true);
  expect(hasText('Siguiente')).toBe(true);
  expect(hasText('90 s descanso')).toBe(true);
  expect(hasText('Pendiente · 30 kg × 8 reps')).toBe(true);
  expect(hasText('Finalizar sesión')).toBe(true);
  expect(hasText('Todas las series están registradas')).toBe(false);

  await press('Finalizar sesión');
  expect(
    hasText(
      'Tienes 2 series sin registrar en 2 ejercicios. La sesión se guardará como parcial.',
    ),
  ).toBe(true);
  expect(hasText('Seguir entrenando')).toBe(true);
});

test('opens correction overlay and shows a success toast after recording', async () => {
  await ReactTestRenderer.act(async () => {
    tree = ReactTestRenderer.create(
      <TodayScreen navigation={{ getParent: () => undefined } as never} />,
    );
  });
  await press('Corregir serie 1');
  expect(hasText('Corregir serie 1')).toBe(true);
  expect(hasText('Antes: 20 kg')).toBe(true);
  await press('Cancelar corrección');
  await press('Registrar serie 2');
  expect(recordSet).toHaveBeenCalledWith({
    exerciseId: 'e1',
    setNumber: 2,
    loadKg: 20,
    reps: 10,
  });
  expect(hasText('Serie 2 registrada · 20 kg × 10 reps')).toBe(true);
});
