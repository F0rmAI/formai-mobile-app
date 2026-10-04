/* eslint-env jest */
// Without native modules SafeAreaProvider does not render its children: use the official mock.
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);

jest.mock('@react-native-async-storage/async-storage', () => {
  const store = new Map();
  return {
    __esModule: true,
    default: {
      getItem: jest.fn(async (key) =>
        store.has(key) ? store.get(key) : null,
      ),
      setItem: jest.fn(async (key, value) => {
        store.set(key, value);
      }),
      removeItem: jest.fn(async (key) => {
        store.delete(key);
      }),
      clear: jest.fn(async () => {
        store.clear();
      }),
    },
  };
});

jest.mock('@notifee/react-native', () => ({
  __esModule: true,
  default: {
    requestPermission: jest.fn(async () => ({ authorizationStatus: 1 })),
    createChannel: jest.fn(async () => 'workout_reminders'),
    createTriggerNotification: jest.fn(async () => 'id'),
    displayNotification: jest.fn(async () => 'id'),
    cancelAllNotifications: jest.fn(async () => undefined),
    cancelNotification: jest.fn(async () => undefined),
    getTriggerNotificationIds: jest.fn(async () => []),
  },
  AndroidImportance: { DEFAULT: 3, HIGH: 4 },
  AuthorizationStatus: { AUTHORIZED: 1, DENIED: 0, PROVISIONAL: 2 },
  TriggerType: { TIMESTAMP: 0 },
  RepeatFrequency: { NONE: -1, HOURLY: 0, DAILY: 1, WEEKLY: 2 },
  AlarmType: {
    SET: 0,
    SET_AND_ALLOW_WHILE_IDLE: 1,
    SET_EXACT: 2,
    SET_EXACT_AND_ALLOW_WHILE_IDLE: 3,
    SET_ALARM_CLOCK: 4,
  },
}));

jest.mock('@react-native-community/datetimepicker', () => {
  const React = require('react');
  const { View } = require('react-native');
  return {
    __esModule: true,
    default: (props) => React.createElement(View, { testID: 'datetime-picker', ...props }),
    DateTimePickerAndroid: { open: jest.fn(), dismiss: jest.fn() },
  };
});
