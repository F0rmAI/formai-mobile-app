/**
 * Tests for local reminder notification scheduling.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import notifee, {
  AuthorizationStatus,
  TriggerType,
} from '@notifee/react-native';
import { reminderNotificationsService } from '@/services/reminder-notifications.service';
import type { ActiveRoutine } from '@/types/training';

const device = jest.mocked(notifee);
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

beforeEach(() => {
  jest.useFakeTimers();
  jest.setSystemTime(new Date(2026, 9, 5, 6, 0));
  jest.clearAllMocks();
  device.getTriggerNotificationIds.mockResolvedValue([]);
  device.requestPermission.mockResolvedValue({
    authorizationStatus: AuthorizationStatus.AUTHORIZED,
  } as Awaited<ReturnType<typeof notifee.requestPermission>>);
});

afterEach(() => jest.useRealTimers());

test('asks for permission and rejects denied access', async () => {
  expect(reminderNotificationsService.isAvailable()).toBe(true);
  await expect(reminderNotificationsService.requestPermission()).resolves.toBe(
    true,
  );
  device.requestPermission.mockResolvedValueOnce({
    authorizationStatus: AuthorizationStatus.DENIED,
  } as Awaited<ReturnType<typeof notifee.requestPermission>>);
  await expect(reminderNotificationsService.requestPermission()).resolves.toBe(
    false,
  );
});

test('cancels only FormAI reminders', async () => {
  device.getTriggerNotificationIds.mockResolvedValueOnce([
    'formai-reminder-1',
    'another-app-1',
  ]);

  await reminderNotificationsService.cancelAll();

  expect(device.cancelNotification).toHaveBeenCalledTimes(1);
  expect(device.cancelNotification).toHaveBeenCalledWith('formai-reminder-1');
});

test('schedules future training days and skips a completed session today', async () => {
  await reminderNotificationsService.syncSchedule({
    prefs: { enabled: true, hour: 7, minute: 0 },
    routine,
    todayStatus: 'COMPLETED',
  });

  expect(device.createChannel).toHaveBeenCalledWith(
    expect.objectContaining({ id: 'workout_reminders' }),
  );
  expect(device.createTriggerNotification).toHaveBeenCalledTimes(1);
  expect(device.createTriggerNotification).toHaveBeenCalledWith(
    expect.objectContaining({ title: 'Hoy toca Piernas' }),
    expect.objectContaining({ type: TriggerType.TIMESTAMP }),
  );
  const trigger = device.createTriggerNotification.mock.calls[0][1];
  if (trigger.type !== TriggerType.TIMESTAMP) {
    throw new Error('Expected a timestamp trigger');
  }
  expect(new Date(trigger.timestamp).getDate()).toBe(12);
});

test('does not schedule when reminders are disabled', async () => {
  await reminderNotificationsService.syncSchedule({
    prefs: { enabled: false, hour: 7, minute: 0 },
    routine,
  });

  expect(device.createTriggerNotification).not.toHaveBeenCalled();
});

test('displays a sample through the reminder channel', async () => {
  await reminderNotificationsService.displaySample({
    title: 'Hoy toca Piernas',
    body: 'Tienes una sesión pendiente.',
  });

  expect(device.displayNotification).toHaveBeenCalledWith(
    expect.objectContaining({
      title: 'Hoy toca Piernas',
      android: expect.objectContaining({ channelId: 'workout_reminders' }),
    }),
  );
});
