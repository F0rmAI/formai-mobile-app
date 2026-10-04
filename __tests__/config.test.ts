/**
 * Tests for build-time API URL selection.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Platform } from 'react-native';

/** Loads the configuration with a fresh mocked build-time URL. */
function apiUrlWith(value: string | undefined) {
  jest.resetModules();
  jest.doMock('@env', () => ({ API_URL: value }));
  return (require('@/services/config') as typeof import('@/services/config'))
    .API_URL;
}

afterEach(() => {
  jest.dontMock('@env');
  jest.resetModules();
});

test('uses the configured URL after trimming spaces and trailing slashes', () => {
  expect(apiUrlWith('  http://192.0.2.10:8080/api/v1///  ')).toBe(
    'http://192.0.2.10:8080/api/v1',
  );
});

test('uses the platform development fallback when the variable is missing', () => {
  expect(apiUrlWith(undefined)).toBe(
    Platform.OS === 'android'
      ? 'http://10.0.2.2:8080/api/v1'
      : 'http://localhost:8080/api/v1',
  );
});

test('uses the platform development fallback when the variable is blank', () => {
  expect(apiUrlWith('  ')).toBe(
    Platform.OS === 'android'
      ? 'http://10.0.2.2:8080/api/v1'
      : 'http://localhost:8080/api/v1',
  );
});

test('requires a configured URL in release builds', () => {
  const buildGlobals = globalThis as typeof globalThis & { __DEV__: boolean };
  const previousDev = buildGlobals.__DEV__;
  try {
    buildGlobals.__DEV__ = false;
    expect(() => apiUrlWith(undefined)).toThrow(
      'API_URL is required for release builds.',
    );
  } finally {
    buildGlobals.__DEV__ = previousDev;
  }
});

test('uses the configured URL in release builds', () => {
  const buildGlobals = globalThis as typeof globalThis & { __DEV__: boolean };
  const previousDev = buildGlobals.__DEV__;
  try {
    buildGlobals.__DEV__ = false;
    expect(apiUrlWith('https://api.example.test/api/v1')).toBe(
      'https://api.example.test/api/v1',
    );
  } finally {
    buildGlobals.__DEV__ = previousDev;
  }
});
