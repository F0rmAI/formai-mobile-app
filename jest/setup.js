/* eslint-env jest */
// Without native modules SafeAreaProvider does not render its children: use the official mock.
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);
