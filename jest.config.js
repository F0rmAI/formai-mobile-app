module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest/setup.js'],
  // React Navigation se publica como ESM: Babel también debe transformarlo.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?|@react-navigation)/)',
  ],
  moduleNameMapper: {
    // Metro compiles global.css through the styling binding; in Jest an empty module is enough.
    '\\.css$': '<rootDir>/jest/style-mock.js',
  },
};
