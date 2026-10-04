/**
 * Tests for the password-reset resource contract.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { ApiError } from '@/services/api-client';
import { API_URL } from '@/services/config';
import {
  isRejectedResetLink,
  passwordResetService,
} from '@/services/password-reset.service';

const fetchMock = jest.fn();
const originalFetch = globalThis.fetch;

beforeEach(() => {
  globalThis.fetch = fetchMock as unknown as typeof fetch;
});

afterEach(() => {
  globalThis.fetch = originalFetch;
  fetchMock.mockReset();
});

function response(status: number) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => null },
  };
}

test('requests a link with the entered email', async () => {
  fetchMock.mockResolvedValue(response(201));

  await passwordResetService.requestLink('client@example.com');

  expect(fetchMock).toHaveBeenCalledWith(
    `${API_URL}/password-reset-requests`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ email: 'client@example.com' }),
    }),
  );
});

test('redeems a token with the new password', async () => {
  fetchMock.mockResolvedValue(response(201));

  await passwordResetService.resetPassword({
    token: 'tok',
    password: 'new-pass-123',
  });

  expect(fetchMock).toHaveBeenCalledWith(
    `${API_URL}/password-resets`,
    expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ token: 'tok', password: 'new-pass-123' }),
    }),
  );
});

test('classifies invalid or expired reset links by HTTP status', () => {
  expect(isRejectedResetLink(new ApiError(422, 'expired'))).toBe(true);
  expect(isRejectedResetLink(new ApiError(500, 'failure'))).toBe(false);
});
