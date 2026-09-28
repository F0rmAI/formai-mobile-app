module.exports = {
  preset: '@react-native/jest-preset',
  setupFiles: ['<rootDir>/jest/setup.js'],
  moduleNameMapper: {
    // Metro compila global.css con Uniwind; en Jest basta con un módulo vacío.
    '\\.css$': '<rootDir>/jest/style-mock.js',
  },
};
