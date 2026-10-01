/**
 * Tests for the HTTP client.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { ApiError, apiClient } from '@/services/api-client';
import { API_URL } from '@/services/config';

/** Builds the minimal response shape the client reads. */
function jsonResponse(body: unknown, status = 200) {
  return {
    ok: status >= 200 && status < 300,
    status,
    headers: { get: () => (body === undefined ? null : 'application/json') },
    json: async () => body,
  } as unknown as Response;
}

describe('apiClient', () => {
  const fetchMock = jest.fn<Promise<Response>, Parameters<typeof fetch>>();
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    globalThis.fetch = fetchMock as unknown as typeof fetch;
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    fetchMock.mockReset();
  });

  it('sends a GET request to the base URL and returns the parsed body', async () => {
    fetchMock.mockResolvedValue(jsonResponse([{ id: '1' }]));

    const result = await apiClient.get<{ id: string }[]>('/items');

    expect(result).toEqual([{ id: '1' }]);
    expect(fetchMock).toHaveBeenCalledWith(
      `${API_URL}/items`,
      expect.objectContaining({ method: 'GET', body: undefined }),
    );
  });

  it('serializes the body and sets the JSON content type on POST', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ id: '1' }, 201));

    await apiClient.post('/items', { name: 'Item' });

    const init = fetchMock.mock.calls[0][1];
    expect(init?.method).toBe('POST');
    expect(init?.body).toBe(JSON.stringify({ name: 'Item' }));
    expect(init?.headers).toMatchObject({ 'Content-Type': 'application/json' });
  });

  it('throws an ApiError with the status and body when the response is not successful', async () => {
    fetchMock.mockResolvedValue(jsonResponse({ message: 'Not found' }, 404));

    const error = await apiClient
      .get('/items/9')
      .catch((reason: unknown) => reason);

    expect(error).toBeInstanceOf(ApiError);
    expect(error).toMatchObject({
      status: 404,
      body: { message: 'Not found' },
    });
  });

  it('returns undefined when the response has no JSON body', async () => {
    fetchMock.mockResolvedValue(jsonResponse(undefined, 204));

    await expect(apiClient.delete('/items/1')).resolves.toBeUndefined();
  });
});
