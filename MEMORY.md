# MEMORY.md - FormAI Mobile App

Inter-session project memory. This file contains about 50 lines: summarize or remove content that no longer adds value.

## Current status (2026-10-03)
- On `feature/reminders`: wireflow 4 (Perfil, recordatorios, cierre de sesión) — Profile polish, `RemindersScreen`, local prefs + Notifee, in-app preview 4.3. No reminder REST API.
- `develop` holds auth, training, progress/historial, and `/api` integration.
- Machine recognition (wireflow 5 / TB2) remains for a later increment.

## Decisions (and why)
- No CLIENT reminder endpoints exist: prefs live in AsyncStorage; notifications are local (Notifee). Do not invent HTTP reminder services.
- Omit **Mi entrenador** until `client-profiles/me` exposes a trainer name.
- Training days for scheduling come from existing `active-routines/me`; skip today’s fire if session status is `COMPLETED`.
- Backend DTOs stay authoritative for progress charts; stats/adherence derived from workout sessions.
- Session refresh shares one request after 401/403 and retries once.

## Lessons learned and mistakes to avoid
- For local `formai-api`, set `JWT_COOKIE_SECURE=false`.
- Use `refreshSession` in `api-client.ts`; do not start parallel refreshes.
- `className` only on RN core components; Android uses `accessibilityRole="tablist"`.
- On Windows Gradle path-length failures under Cursor sandbox, set `GRADLE_USER_HOME=C:\g`.

## Known limits
- Reminder delivery is on-device only (no FCM / server push).
- Preview 4.3 is an in-app mock, not the real OS lock screen.

## Demo data
- Seed: `powershell -File scripts/seed-progress-demo.ps1`. Login `cliente.dev@formai.local` / `ClienteDev1!`.

## Next steps
- Merge `feature/reminders` after device verification (notification permission on Android 13+).
- Then machine scan (wireflow 5 / TB2).
