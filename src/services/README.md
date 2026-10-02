# `services/` — Acceso al backend

Única capa que **habla con la API** de FormAI (Spring Boot detrás de Caddy en `/api`). Traduce
llamadas HTTP a funciones tipadas que consumen los hooks.

## Contenido base

| Archivo | Uso |
|---|---|
| `config.ts` | URL base del backend y prefijos de los enlaces que abren la app. La URL base vive en `services/config.ts` (RN no lee `.env` sin una librería adicional). |
| `auth.service.ts` | Inicio, renovación y cierre de sesión (`/v1/authentication/*`); la sesión viaja en cookies httpOnly. También la recuperación de contraseña: pedir el enlace (`/v1/password-reset-requests`) y canjear su token (`/v1/password-resets`). |
| `client-profile.service.ts` | Nombre y correo del cliente con sesión (`/v1/client-profiles/me`). |
| `account-activation.service.ts` | Verificación del código (`/v1/activation-code-verifications`) y activación de la cuenta con el correo que elige el cliente (`/v1/account-activations`). |
| `api-client.ts` | Cliente `fetch` único (`apiClient.get/post/put/patch/delete`) con JSON y `ApiError` tipado. |

## Reglas

- Un archivo por recurso o bounded context del backend: `clients.service.ts`, `routines.service.ts`, `machines.service.ts`…
- Todas las llamadas pasan por `apiClient`; no se usa `fetch` suelto en otras capas.
- Sin estado ni React: funciones puras y asíncronas que devuelven tipos de `types/`.
- Aquí se mapean los DTO del backend a los modelos del front si difieren.

## Ejemplo

```ts
import { apiClient } from './api-client';
import type { Client } from '@/types/client';

export const clientsService = {
  list: () => apiClient.get<Client[]>('/clients'),
  create: (input: CreateClientInput) => apiClient.post<Client>('/clients', input),
};
```
