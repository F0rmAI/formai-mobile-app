/**
 * Tests for display name formatting.
 *
 * @author Carlos
 * @packageDocumentation
 */

import { firstNameOf } from '@/utils/names';

test('returns the first name for the greeting', () => {
  expect(firstNameOf('Diego Paredes')).toBe('Diego');
  expect(firstNameOf('  María  José Ríos ')).toBe('María');
  expect(firstNameOf('Luis')).toBe('Luis');
});
