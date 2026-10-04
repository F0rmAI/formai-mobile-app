# `services/` — Acceso al backend

Única capa que **habla con la API** de FormAI (Spring Boot detrás de Caddy en `/api`). Traduce
llamadas HTTP a funciones tipadas que consumen los hooks.

## Contenido base

| Archivo | Uso |
|---|---|
| `config.ts` | Único lector de `API_URL` desde `@env` (incorporada por Babel al compilar); recorta espacios y barras finales. Si falta, usa las URL de simulador/emulador en debug o HTTPS de producción en release. También define los prefijos de los enlaces que abren la app. |
| `auth.service.ts` | Inicio, renovación y cierre de sesión (`/authentication/*`); la sesión viaja en cookies httpOnly. |
| `password-reset.service.ts` | Solicitud del enlace (`/password-reset-requests`) y canje de su token (`/password-resets`). |
| `client-profile.service.ts` | Nombre y correo del cliente con sesión (`/client-profiles/me`). |
| `account-activation.service.ts` | Verificación del código (`/activation-code-verifications`) y activación de la cuenta con el correo que elige el cliente (`/account-activations`). |
| `api-client.ts` | Cliente `fetch` único (`apiClient.get/post/put/patch/delete`) con JSON, `ApiError` y refresh compartido de sesión. |
| `active-routine.service.ts` | Rutina vigente del cliente. |
| `workout-session.service.ts` | Sesiones, historial, series, correcciones y finalización. |
| `progress-chart.service.ts` | Evolución de carga y volumen del cliente (`/progress-charts/me`). |
| `reminder-prefs.service.ts` | Prefs de recordatorios en AsyncStorage (no HTTP; no hay endpoint). |
| `reminder-notifications.service.ts` | Canal y programación local con Notifee (no HTTP). |
| `reminder-session.service.ts` | Limpia prefs y avisos al cerrar sesión. |

En desarrollo, ejecuta formai-api local con `JWT_COOKIE_SECURE=false` (su valor predeterminado es `true`). Los almacenes de cookies nativos de iOS y Android descartan las cookies `Secure` sobre HTTP: el inicio de sesión puede responder 200, pero la siguiente llamada protegida dará 401/403. Navegadores y `curl` tratan `localhost` como seguro, por eso la web puede funcionar. Sin `API_URL` en `.env`, `config.ts` usa `localhost:8080` en iOS y `10.0.2.2:8080` en Android; para un teléfono físico, define la IP LAN de la Mac en `.env` y recompila. `authService.confirmSession` comprueba la cookie una vez antes de marcar al usuario como autenticado; esa llamada usa `skipRefresh` para no invocar el cierre de sesión global si falla.

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
