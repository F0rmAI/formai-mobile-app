module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest/setup.js'],
  // React Navigation se publica como ESM: Babel también debe transformarlo.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation)/)',
  ],
  moduleNameMapper: {
    // Metro compila global.css con Uniwind; en Jest basta con un módulo vacío.
    '\\.css$': '<rootDir>/jest/style-mock.js',
  },
};
