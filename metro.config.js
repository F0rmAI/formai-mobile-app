const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');
const { withUniwindConfig } = require('uniwind/metro');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('@react-native/metro-config').MetroConfig}
 */
const config = {};

// Uniwind (Tailwind CSS v4 para React Native) debe ser el envoltorio más externo.
module.exports = withUniwindConfig(
  mergeConfig(getDefaultConfig(__dirname), config),
  {
    cssEntryFile: './src/global.css',
    dtsFile: './src/types/uniwind-types.d.ts',
  },
);
