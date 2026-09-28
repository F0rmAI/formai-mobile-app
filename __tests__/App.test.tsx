/**
 * @format
 */

import ReactTestRenderer from 'react-test-renderer';
import App from '@/App';

jest.mock('@/hooks/useTraining', () => {
  const routine = {
    routineId: 'routine-test',
    routineName: 'Rutina de prueba',
    version: 1,
    startDate: '2026-09-28',
    todaySessionOrder: 1,
    todayWorkoutSessionId: 'session-test',
    trainerName: 'Carla Ríos',
    sessions: [{ order: 1, label: 'Día A', exercises: [] }],
  };
  const session = {
    id: 'session-test',
    scheduledFor: '2026-09-28',
    dayLabel: 'Día A',
    routineVersion: 1,
    status: 'IN_PROGRESS',
    totalVolumeKg: 0,
    exercises: [],
  };
  return {
    useTraining: () => ({
      routine,
      session,
      summary: {
        session,
        completedSets: 0,
        targetSets: 0,
        isPartial: false,
      },
      loading: false,
      saving: false,
      error: undefined,
      retry: jest.fn(),
      recordSet: jest.fn(),
      finishSession: jest.fn(),
    }),
  };
});

test('carga el entrenamiento de hoy y permite abrir la rutina', async () => {
  let renderer!: ReactTestRenderer.ReactTestRenderer;
  await ReactTestRenderer.act(() => {
    renderer = ReactTestRenderer.create(<App />);
  });

  expect(renderer.root.findByProps({ testID: 'today-screen' })).toBeTruthy();

  await ReactTestRenderer.act(() => {
    renderer.root
      .findByProps({ testID: 'view-routine-button' })
      .props.onPress();
  });

  expect(renderer.root.findByProps({ testID: 'routine-screen' })).toBeTruthy();
});
