# MEMORY.md - FormAI Mobile App

Inter-session project memory. This file contains about 50 lines: summarize or remove content that no longer adds value.

## Current status (2026-10-04)
- `fix/local-date-and-session-status`: device time zone header, latest result per routine day, Progress reload on focus. Needs `formai-api` branch `feature/client-timezone-and-day-validation`. Jest and audit pass; iOS/Android and API E2E not yet verified.
- `develop` holds auth, activation (incl. US-035 join another trainer), today session, routine, progress/history, profile and local reminders. Release 0.1.0 candidate prepared for PR to `main`.
- TP scope (TB1, due 2026-10-09): US-002, 004, 005, 012, 013, 014, 015, 035, 036. All pass an API E2E run against local `formai-api`.
- Screens aligned with Figma `formai_mobile_mockup` + `formai_wireflows` 1-4. Machine recognition (wireflow 5 / TB2) remains for a later increment.

## Decisions (and why)
- A day is the client's own date: the HTTP client sends the device IANA zone in `X-Client-Timezone` (omitted if `Intl` gives none, since the API answers 400 to an unknown zone) and the API schedules by it. A UTC server used to show the next day's session from 19:00 in Peru.
- Routine days show `lastSessionDate` / `lastSessionStatus` from `active-routines/me`; without them the card keeps "Por realizar".
- Today distinguishes a local training day awaiting scheduling from a genuine rest day; Progress reloads when its tab gains focus.
- `API_URL` includes `/api/v1`; service paths start at the resource (`/authentication/...`), so the version prefix has one owner. Debug uses emulator defaults; release requires a private build-time value.
- No CLIENT reminder endpoints exist: prefs live in AsyncStorage; notifications are local (Notifee). Do not invent HTTP reminder services.
- Never fake data the API lacks: no trainer name ("Mi entrenador"), no equipment/muscle subtitle, no session duration.
- Training days for scheduling come from `active-routines/me`; skip today's fire if session status is `COMPLETED`.
- Backend DTOs stay authoritative for progress charts; stats/adherence derived from workout sessions.
- Session refresh shares one request after 401/403 and retries once.
- Android release signing reads credentials from environment variables; debug signing requires an explicit demo-only Gradle property.

## Lessons learned and mistakes to avoid
- Figma mockup frames clip a `Content` node taller than 852px: inspect the `Content` node, not the frame, or content below the fold is missed.
- Figma MCP `get_metadata` without nodeId lists only the first page; use `use_figma` with `figma.root.children` to list all pages.
- For local `formai-api`, set `JWT_COOKIE_SECURE=false`. Sign-in body needs `application: MOBILE_APP`.
- Xcode 27 rejects pod targets below iOS 15: the Podfile `post_install` raises them to `min_ios_version_supported`.
- `className` only on RN core components; Android uses `accessibilityRole="tablist"`.
- On Windows Gradle path-length failures under Cursor sandbox, set `GRADLE_USER_HOME=C:\g`.

## Known limits
- A previous public history contains a production API URL and demo credentials. Removing them from the release tree does not erase existing commits; rotate credentials if reused.
- Distribution still needs private API and signing values supplied by the release environment.
- Reminder delivery is on-device only (no FCM / server push). Preview 4.3 is an in-app mock.
- Android emulator run not verified in the 2026-10-03 session (no device attached).

## Demo data
- Windows seed: `powershell -File scripts/seed-progress-demo.ps1` requires local demo users and `FORMAI_SEED_*` environment values. A fresh DB has no users: create them through the API (sign-up trainer, register client, activate code).

## Next steps
- Verify on Android emulator; then machine scan (wireflow 5 / TB2).
