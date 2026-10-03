# MEMORY.md - FormAI Mobile App

Inter-session project memory. This file contains about 50 lines: summarize or remove content that no longer adds value.

## Current status (2026-10-03)
- Branch `feature/progress-metrics` delivers wireflow 3 (Progreso e historial): dashboard with 4/8/12 weeks, stats, adherence, exercise charts via `GET /progress-charts/me`, historial screen with filter dialog, and detail set tiles.
- `develop` still holds auth, training, and `/api` integration as the deployment base.
- Reminders and machine recognition remain for later increments.

## Decisions (and why)
- Backend DTOs are authoritative: no invented chart metrics; client stats/adherence are derived from `WorkoutSession` fields in the selected weeks window because progress-reports is trainer-only.
- Charts use `enoughData` from the API; with fewer than two points the UI shows the insufficient-data empty state.
- Line charts are View-based (no third-party chart library) to stay compatible with RN 0.87.
- History filter lives in `WorkoutHistoryScreen` + `HistoryFilterDialog`; Progress tab is the dashboard with a history preview.
- Session refresh shares one request after an initial 401 or 403 and retries once. A failed refresh returns to Welcome.

## Lessons learned and mistakes to avoid
- For local `formai-api`, set `JWT_COOKIE_SECURE=false`: simulators do not send `Secure` cookies over HTTP.
- Do not start independent refresh requests; use `refreshSession` in `api-client.ts`.
- `className` works only on React Native core components. Android rejects `accessibilityRole="tabbar"`; use `tablist`.

## Known limits
- On the first load from Metro, Welcome images may take a moment to appear on Android.
- Duration in history rows is derived from `finishedAt` and set `recordedAt` when both exist; otherwise `—`.

## Demo data
- Seed script: `powershell -File scripts/seed-progress-demo.ps1` (API + SQL). Login `cliente.dev@formai.local` / `ClienteDev1!`. Assign only schedules today; past sessions are inserted in Postgres.
- On Windows Gradle/CMake path-length failures under the Cursor sandbox, set `GRADLE_USER_HOME=C:\g` or reinstall `android/app/build/outputs/apk/debug/app-debug.apk`.

## Next steps
- Deliver reminders (wireflow 4) and machine scan (wireflow 5 / TB2).
- Merge `feature/progress-metrics` after review and device verification.
