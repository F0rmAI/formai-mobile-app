/**
 * Authenticated client profile resource.
 *
 * @author Carlos
 * @packageDocumentation
 */

import { apiClient } from './api-client';
import type { ClientProfile } from '@/types/client-profile';

/** Fetches the profile of the currently authenticated client. */
export const clientProfileService = {
  /**
   * Fetches the profile of the signed-in client.
   *
   * @returns The client name and email associated with the session cookie.
   * @throws {@link ApiError} when the session is missing or the request fails.
   */
  getMine: () => apiClient.get<ClientProfile>('/client-profiles/me'),
};
