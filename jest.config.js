module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest/setup.js'],
  moduleNameMapper: {
    // Metro compiles global.css through the styling binding; in Jest an empty module is enough.
    '\\.css$': '<rootDir>/jest/style-mock.js',
  },
};
