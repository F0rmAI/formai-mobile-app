/**
 * Tests for reminder state, permission and schedule updates.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import ReactTestRenderer from 'react-test-renderer';
import { useReminders } from '@/hooks/useReminders';
import { useActiveRoutine } from '@/hooks/useActiveRoutine';
import { reminderNotificationsService } from '@/services/reminder-notifications.service';
import { reminderPrefsService } from '@/services/reminder-prefs.service';
import { workoutSessionService } from '@/services/workout-session.service';
import type { ActiveRoutine, WorkoutSession } from '@/types/training';

jest.mock('@react-navigation/native', () => ({
  useFocusEffect: (callback: () => void | (() => void)) => {
    const { useEffect } = jest.requireActual<typeof import('react')>('react');
    useEffect(callback, [callback]);
  },
}));
jest.mock('@/hooks/useActiveRoutine', () => ({ useActiveRoutine: jest.fn() }));
jest.mock('@/services/reminder-notifications.service', () => ({
  reminderNotificationsService: {
    isAvailable: jest.fn(),
    requestPermission: jest.fn(),
    syncSchedule: jest.fn(),
  },
}));
jest.mock('@/services/reminder-prefs.service', () => ({
  reminderPrefsService: { load: jest.fn(), save: jest.fn() },
}));
jest.mock('@/services/workout-session.service', () => ({
  workoutSessionService: { getWorkoutSession: jest.fn() },
}));

const routine: ActiveRoutine = {
  routineId: 'r1',
  routineName: 'Fuerza',
  version: 1,
  startDate: '2026-10-01',
  trainingDays: ['MONDAY'],
  todaySessionOrder: 1,
  todayWorkoutSessionId: 's1',
  sessions: [{ order: 1, label: 'Piernas', exercises: [] }],
};
const session = {
  id: 's1',
  status: 'COMPLETED',
} as WorkoutSession;
const notifications = jest.mocked(reminderNotificationsService);
const prefsService = jest.mocked(reminderPrefsService);
const workoutService = jest.mocked(workoutSessionService);

let state!: ReturnType<typeof useReminders>;
let renderer: ReactTestRenderer.ReactTestRenderer | undefined;

function Harness() {
  state = useReminders();
  return null;
}

beforeEach(() => {
  jest.clearAllMocks();
  jest.mocked(useActiveRoutine).mockReturnValue({ routine } as ReturnType<
    typeof useActiveRoutine
  >);
  prefsService.load.mockResolvedValue({ enabled: false, hour: 7, minute: 0 });
  prefsService.save.mockResolvedValue();
  notifications.isAvailable.mockReturnValue(true);
  notifications.requestPermission.mockResolvedValue(true);
  notifications.syncSchedule.mockResolvedValue();
  workoutService.getWorkoutSession.mockResolvedValue(session);
});

afterEach(async () => {
  if (renderer) {
    await ReactTestRenderer.act(async () => renderer?.unmount());
    renderer = undefined;
  }
});

async function mount() {
  await ReactTestRenderer.act(async () => {
    renderer = ReactTestRenderer.create(<Harness />);
  });
}

test('loads local prefs and syncs a completed workout status', async () => {
  await mount();

  expect(state.isReady).toBe(true);
  expect(state.enabled).toBe(false);
  expect(state.timeLabel).toBe('7:00 a. m.');
  expect(workoutService.getWorkoutSession).toHaveBeenCalledWith('s1');
  expect(notifications.syncSchedule).toHaveBeenCalledWith({
    prefs: { enabled: false, hour: 7, minute: 0 },
    routine,
    todayStatus: 'COMPLETED',
  });
});

test('requests permission before enabling and saves the new prefs', async () => {
  await mount();
  await ReactTestRenderer.act(async () => state.setEnabled(true));

  expect(notifications.requestPermission).toHaveBeenCalledTimes(1);
  expect(prefsService.save).toHaveBeenCalledWith({
    enabled: true,
    hour: 7,
    minute: 0,
  });
  expect(state.enabled).toBe(true);
});

test('keeps reminders off when permission is denied', async () => {
  notifications.requestPermission.mockResolvedValue(false);
  await mount();
  await ReactTestRenderer.act(async () => state.setEnabled(true));

  expect(state.enabled).toBe(false);
  expect(prefsService.save).not.toHaveBeenCalled();
  expect(state.error).toBe(
    'Necesitamos permiso de notificaciones para recordarte tus sesiones.',
  );
});

test('reports a save failure without changing the selected time', async () => {
  prefsService.save.mockRejectedValueOnce(new Error('storage unavailable'));
  await mount();
  await ReactTestRenderer.act(async () => state.setTime(18, 30));

  expect(state.timeLabel).toBe('7:00 a. m.');
  expect(state.error).toBe(
    'No pudimos guardar tus recordatorios. Inténtalo de nuevo.',
  );
  expect(state.isSaving).toBe(false);
});
