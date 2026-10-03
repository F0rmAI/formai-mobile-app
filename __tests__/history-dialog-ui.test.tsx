/**
 * Accessibility and history screen regression tests.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import ReactTestRenderer from 'react-test-renderer';
import { Dialog } from '@/components/ui/Dialog';
import { SetEditor } from '@/components/training/SetEditor';
import { useClientProfile } from '@/hooks/useClientProfile';
import { useProgressDashboard } from '@/hooks/useProgressDashboard';
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory';
import { useWorkoutSession } from '@/hooks/useWorkoutSession';
import { ProgressScreen } from '@/screens/ProgressScreen';
import { WorkoutDetailScreen } from '@/screens/WorkoutDetailScreen';
import { WorkoutHistoryScreen } from '@/screens/WorkoutHistoryScreen';
import type { WorkoutSession } from '@/types/training';

jest.mock('@/hooks/useClientProfile', () => ({ useClientProfile: jest.fn() }));
jest.mock('@/hooks/useProgressDashboard', () => ({
  useProgressDashboard: jest.fn(),
}));
jest.mock('@/hooks/useWorkoutHistory', () => ({ useWorkoutHistory: jest.fn() }));
jest.mock('@/hooks/useWorkoutSession', () => ({ useWorkoutSession: jest.fn() }));

const session: WorkoutSession = {
  id: 's1',
  scheduledFor: '2026-10-02',
  dayLabel: 'Día A',
  routineVersion: 1,
  status: 'COMPLETED',
  totalVolumeKg: 200,
  finishedAt: '2026-10-02T18:00:00Z',
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
          recordedAt: '2026-10-02T17:00:00Z',
        },
      ],
    },
  ],
};

const mockedProfile = jest.mocked(useClientProfile);
const mockedDashboard = jest.mocked(useProgressDashboard);
const mockedHistory = jest.mocked(useWorkoutHistory);
const mockedSession = jest.mocked(useWorkoutSession);
const onClear = jest.fn();
const historyState = {
  from: '2026-10-01',
  to: '2026-10-02',
  setFrom: jest.fn(),
  setTo: jest.fn(),
  appliedFrom: '2026-10-01' as string | undefined,
  appliedTo: '2026-10-02' as string | undefined,
  sessions: [] as WorkoutSession[],
  totalElements: 0,
  isFiltered: true,
  isLoading: false,
  error: undefined,
  applyFilter: jest.fn(),
  clearFilter: onClear,
  retry: jest.fn(),
  loadMore: jest.fn(),
  hasMore: false,
};

const dashboardState = {
  weeks: 4 as const,
  weekOptions: [
    { label: '4 sem', value: '4' as const },
    { label: '8 sem', value: '8' as const },
    { label: '12 sem', value: '12' as const },
  ],
  weeksValue: '4' as const,
  setWeeks: jest.fn(),
  sessions: [] as WorkoutSession[],
  previewSessions: [] as WorkoutSession[],
  exercises: [],
  selectedExerciseId: undefined,
  selectedExercise: undefined,
  selectExercise: jest.fn(),
  chart: undefined,
  stats: {
    sessionCount: 0,
    volumeKg: 0,
    completedCount: 0,
    scheduledCount: 0,
    adherencePercentage: 0,
  },
  isLoading: false,
  isChartLoading: false,
  error: undefined,
  retry: jest.fn(),
};

let renderer: ReactTestRenderer.ReactTestRenderer;
const hasText = (value: string) =>
  renderer.root.findAll(node => node.props.children === value).length > 0;

beforeEach(() => {
  jest.clearAllMocks();
  mockedProfile.mockReturnValue({
    headerUser: undefined,
  } as ReturnType<typeof useClientProfile>);
  mockedDashboard.mockReturnValue(
    dashboardState as ReturnType<typeof useProgressDashboard>,
  );
  mockedHistory.mockReturnValue(historyState);
  mockedSession.mockReturnValue({
    session,
    isLoading: false,
    error: undefined,
    retry: jest.fn(),
  });
});

afterEach(async () => {
  if (renderer) {
    await ReactTestRenderer.act(async () => renderer.unmount());
  }
});

test('dialog keeps its backdrop dismissable and exposes every content element', async () => {
  const onCancel = jest.fn();
  const onConfirm = jest.fn();
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <Dialog
        open
        title="¿Finalizar la sesión?"
        description="Faltan 2 series."
        cancelLabel="Seguir"
        confirmLabel="Finalizar parcial"
        onCancel={onCancel}
        onConfirm={onConfirm}
      />,
    );
  });

  const backdrop = renderer.root.findAll(
    node =>
      node.props.accessibilityLabel === 'Seguir' &&
      node.props.className?.includes('absolute'),
  )[0];
  expect(backdrop).toBeDefined();
  expect(hasText('¿Finalizar la sesión?')).toBe(true);
  expect(hasText('Faltan 2 series.')).toBe(true);
  await ReactTestRenderer.act(async () => {
    backdrop.props.onPress();
  });
  expect(onCancel).toHaveBeenCalledTimes(1);
  const confirm = renderer.root
    .findAllByProps({
      accessibilityRole: 'button',
      accessibilityLabel: 'Finalizar parcial',
    })
    .find(node => typeof node.props.onPress === 'function');
  expect(confirm).toBeDefined();
  await ReactTestRenderer.act(async () => {
    confirm?.props.onPress();
  });
  expect(onConfirm).toHaveBeenCalledTimes(1);
}, 15000);

test('progress dashboard shows the empty history preview', async () => {
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <ProgressScreen navigation={{ getParent: () => undefined } as never} />,
    );
  });
  expect(hasText('Tu progreso')).toBe(true);
  expect(hasText('Aún no hay entrenamientos')).toBe(true);
  expect(hasText('Datos insuficientes')).toBe(false);
});

test('progress dashboard shows insufficient chart data for one point', async () => {
  mockedDashboard.mockReturnValue({
    ...dashboardState,
    exercises: [{ exerciseId: 'e1', exerciseName: 'Press' }],
    selectedExerciseId: 'e1',
    chart: {
      exerciseId: 'e1',
      weeks: 4,
      enoughData: false,
      points: [{ date: '2026-10-02', maxLoadKg: 20, volumeKg: 200 }],
    },
  } as ReturnType<typeof useProgressDashboard>);
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <ProgressScreen navigation={{ getParent: () => undefined } as never} />,
    );
  });
  expect(hasText('Datos insuficientes')).toBe(true);
});

test('history shows the filtered empty state and clears the range', async () => {
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <WorkoutHistoryScreen
        navigation={{ goBack: jest.fn(), navigate: jest.fn() } as never}
        route={{ key: 'h', name: 'WorkoutHistory' } as never}
      />,
    );
  });
  expect(hasText('Sin entrenamientos en este rango')).toBe(true);
  expect(hasText('Aún no hay entrenamientos')).toBe(false);
  const clear = renderer.root.findByProps({
    accessibilityRole: 'button',
    accessibilityLabel: 'Quitar filtro',
  });
  await ReactTestRenderer.act(async () => clear.props.onPress());
  expect(onClear).toHaveBeenCalledTimes(1);
});

test('history shows the total filtered count and formatted list date', async () => {
  mockedHistory.mockReturnValue({
    ...historyState,
    sessions: [session],
    totalElements: 2,
  });
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <WorkoutHistoryScreen
        navigation={{ goBack: jest.fn(), navigate: jest.fn() } as never}
        route={{ key: 'h', name: 'WorkoutHistory' } as never}
      />,
    );
  });
  expect(hasText('2 entrenamientos en este rango')).toBe(true);
  expect(hasText('Día A')).toBe(true);
  expect(hasText('Viernes 2 oct')).toBe(true);
});

test('detail shows the full Spanish date and set tiles', async () => {
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <WorkoutDetailScreen
        navigation={{ goBack: jest.fn() } as never}
        route={{ params: { sessionId: 's1' } } as never}
      />,
    );
  });
  expect(hasText('Viernes 2 de octubre de 2026')).toBe(true);
  expect(hasText('Serie 1')).toBe(true);
  expect(hasText('20 × 10')).toBe(true);
});

test('recorded sets are marked as corrections in the editor', async () => {
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(
      <SetEditor
        exercise={session.exercises[0]}
        setNumber={1}
        initialLoad={20}
        initialReps={10}
        saving={false}
        onSave={jest.fn()}
      />,
    );
  });
  expect(hasText('Corrigiendo')).toBe(true);
  expect(hasText('En curso')).toBe(false);
});
