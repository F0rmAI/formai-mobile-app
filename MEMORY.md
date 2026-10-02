# MEMORY.md - FormAI Mobile App

## Current status (2026-10-02)
- Branch `feature/api-integration` unifies authentication, React Navigation, training, history and profile. The Today tab uses the real `/api` resources; the state-based TrainingFlow, its second navigation bar and the mock training service are removed.
- Authenticated requests retry once after one shared in-flight refresh on an initial 401 or 403. A failed refresh returns the app to Welcome; a retried 403 remains a forbidden response. Startup restoration uses the same refresh path.
- Today covers no routine, rest day, pending workout, set registration and correction, partial confirmation, and finished summary. Routine and day views use typed stack routes.
- Progress lists paginated sessions with a validated date range and per-session details. Profile shows the backend full name, email and current routine. Activation supports an existing account moving to another trainer with its current password.
- Verification: `npm run typecheck` passes; `npm test -- --runInBand --watchman=false` passes 68 tests. Plain Jest cannot access the Watchman socket in this environment. `npm run lint` reports only the existing `@format` TSDoc errors in `__tests__/dates.test.ts` and `__tests__/names.test.ts`.

## Decisions
- Backend DTOs are authoritative: session states are PENDING, COMPLETED, PARTIAL and SKIPPED; rest-day fields are nullable. Screens show no fabricated trainer, exercise image, duration or progress metrics.
- Training uses one real `training.service.ts`; session and history hooks call it through `apiClient`. Error details from the backend are never displayed to users.
- Account activation validates the backend password range of 8–128 characters so a valid existing password can be used for trainer transfer. HTTP 409 has one neutral message for both conflict cases.

## Pitfalls
- Do not call refresh independently: rotated-token reuse can revoke every session. Use `refreshSession` in `api-client.ts`.
- Keep `tokens.css` byte-identical with the web repo; no token change was needed here.
- `className` is ignored by non-core components such as `SafeAreaView`; use a core View for Uniwind classes.
- Android rejects `accessibilityRole="tabbar"`; use `tablist`. Native runtime verification on both platforms remains necessary when available.
