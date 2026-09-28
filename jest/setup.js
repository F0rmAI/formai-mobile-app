/* eslint-env jest */
// Sin módulos nativos, SafeAreaProvider no renderiza a sus hijos: se usa el mock oficial.
jest.mock(
  'react-native-safe-area-context',
  () => require('react-native-safe-area-context/jest/mock').default,
);
