/**
 * Tests for the HTTP client.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import {
  ApiError,
  apiClient,
  refreshSession,
  setUnauthorizedHandler,
} from '@/services/api-client';
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
    expect(fetchMock.mock.calls[0][1]?.headers).toMatchObject({
      'X-Client-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
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
  it('renews on a protected 403 and retries once', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(undefined, 403))
      .mockResolvedValueOnce(jsonResponse({ id: 'user' }))
      .mockResolvedValueOnce(jsonResponse({ id: 'routine' }));
    await expect(apiClient.get('/active-routines/me')).resolves.toEqual({
      id: 'routine',
    });
    expect(
      fetchMock.mock.calls.map(([url]) => String(url).replace(API_URL, '')),
    ).toEqual([
      '/active-routines/me',
      '/authentication/refresh',
      '/active-routines/me',
    ]);
    expect(fetchMock.mock.calls[2][1]?.headers).toMatchObject({
      'X-Client-Timezone': Intl.DateTimeFormat().resolvedOptions().timeZone,
    });
  });

  it('calls the unauthorized handler after a failed refresh', async () => {
    const handler = jest.fn();
    setUnauthorizedHandler(handler);
    fetchMock
      .mockResolvedValueOnce(jsonResponse(undefined, 403))
      .mockResolvedValueOnce(jsonResponse(undefined, 401));
    await expect(apiClient.get('/client-profiles/me')).rejects.toMatchObject({
      status: 401,
    });
    expect(handler).toHaveBeenCalledTimes(1);
    setUnauthorizedHandler();
  });

  it('skips refresh and the unauthorized handler for session confirmation', async () => {
    const handler = jest.fn();
    setUnauthorizedHandler(handler);
    fetchMock.mockResolvedValue(jsonResponse(undefined, 403));

    await expect(
      apiClient.get('/client-profiles/me', { skipRefresh: true }),
    ).rejects.toMatchObject({ status: 403 });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(handler).not.toHaveBeenCalled();
    setUnauthorizedHandler();
  });

  it('keeps the session after a retried genuine 403', async () => {
    const handler = jest.fn();
    setUnauthorizedHandler(handler);
    fetchMock
      .mockResolvedValueOnce(jsonResponse(undefined, 403))
      .mockResolvedValueOnce(jsonResponse({ id: 'user' }))
      .mockResolvedValueOnce(jsonResponse(undefined, 403));
    await expect(apiClient.get('/active-routines/me')).rejects.toMatchObject({
      status: 403,
    });
    expect(handler).not.toHaveBeenCalled();
    setUnauthorizedHandler();
  });

  it('shares one refresh across concurrent protected requests and startup restore', async () => {
    let resolveRefresh!: (response: Response) => void;
    const deferred = new Promise<Response>(resolve => {
      resolveRefresh = resolve;
    });
    fetchMock.mockImplementation(async url => {
      const path = String(url);
      if (path.endsWith('/refresh')) return deferred;
      if (
        fetchMock.mock.calls.filter(([requestUrl]) => requestUrl === url)
          .length === 1
      )
        return jsonResponse(undefined, 403);
      return jsonResponse({ ok: true });
    });
    const first = apiClient.get('/a');
    const second = apiClient.get('/b');
    await Promise.resolve();
    const restore = refreshSession();
    resolveRefresh(jsonResponse({ id: 'user' }));
    await expect(Promise.all([first, second, restore])).resolves.toEqual([
      { ok: true },
      { ok: true },
      { id: 'user' },
    ]);
    expect(
      fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/refresh')),
    ).toHaveLength(1);
  });

  it('renews after an initial 401, but skips public sign-in errors', async () => {
    fetchMock
      .mockResolvedValueOnce(jsonResponse(undefined, 401))
      .mockResolvedValueOnce(jsonResponse({ id: 'user' }))
      .mockResolvedValueOnce(jsonResponse({ ok: true }))
      .mockResolvedValueOnce(jsonResponse(undefined, 401));
    await expect(apiClient.get('/client-profiles/me')).resolves.toEqual({
      ok: true,
    });
    await expect(
      apiClient.post('/authentication/sign-in', {}),
    ).rejects.toMatchObject({ status: 401 });
    expect(
      fetchMock.mock.calls.filter(([url]) => String(url).endsWith('/refresh')),
    ).toHaveLength(1);
  });

  it('accepts malformed JSON error bodies without crashing', async () => {
    fetchMock.mockResolvedValue({
      ok: false,
      status: 500,
      headers: { get: () => 'application/problem+json' },
      json: async () => {
        throw new Error('bad json');
      },
    } as unknown as Response);
    await expect(apiClient.get('/items')).rejects.toMatchObject({
      status: 500,
      body: undefined,
    });
  });
});
