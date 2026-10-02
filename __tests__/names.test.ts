/**
 * @format
 */

import { firstNameOf } from '@/utils/names';

test('toma el primer nombre para el saludo', () => {
  expect(firstNameOf('Diego Paredes')).toBe('Diego');
  expect(firstNameOf('  María  José Ríos ')).toBe('María');
  expect(firstNameOf('Luis')).toBe('Luis');
});
