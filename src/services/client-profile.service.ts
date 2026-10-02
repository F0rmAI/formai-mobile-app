import { apiClient } from './api-client';
import type { ClientProfile } from '@/types/client-profile';

/** Datos del cliente con sesión iniciada (requiere la cookie de sesión). */
export const clientProfileService = {
  getMine: () => apiClient.get<ClientProfile>('/v1/client-profiles/me'),
};
