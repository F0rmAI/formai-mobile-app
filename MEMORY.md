# MEMORY.md - FormAI Mobile App

Inter-session project memory. This file contains about 50 lines: summarize or remove content that no longer adds value.

## Current status (2026-10-02)
- `develop` contains authentication, training, `/api` integration, and a single standard; it is the deployment branch. The feature branches are integrated.
- The app shows Welcome, activation, sign-in/sign-out, deep-link password recovery, Today, routine/day, summary, history/detail, and Profile. Current flows have no mock services.
- On 2026-10-02, the full client flow ran against local `formai-api` on iOS Simulator (iPhone 17, iOS 26.4) and Android Emulator (Medium_Phone_API_36.1, Android 16): code activation and consent, sign-in, no-routine state, today's session, set logging and correction, partial completion with confirmation, summary, history and detail, profile, routine, sign-out, and deep-link password recovery. No platform-specific fix was needed.
- Progress lists sessions and supports date filtering. Metrics, charts, reminders, and machine recognition belong to the next increment.
- After simulator adjustments, the frontend audit passes (0 errors, 0 warnings), lint and typecheck pass, and Jest passes with `--watchman=false` (14 suites, 84 tests).

## Decisions (and why)
- Backend DTOs are authoritative: use `PENDING`, `COMPLETED`, `PARTIAL`, and `SKIPPED`, nullable fields on rest days, and no invented metrics.
- Each resource has its own service through `apiClient`; recovery, current routine, and sessions have separate files. Data hooks expose `isLoading`, safe Spanish errors, and reload actions.
- Screen insets and toast placement live in layout primitives; Welcome dimensions live in UI. `tokens.css` did not change.
- Tests live in `__tests__/`: activation, authentication, and recovery test their hooks through the app; loading hooks have direct tests.
- The dialog uses a touchable backdrop beside its panel so VoiceOver reaches the title, description, and buttons. Decorative icons are hidden from accessibility, and Button announces its label.
- UI automation uses Maestro: decorative icons are hidden from accessibility and buttons expose their labels, so flows can select visible text.
- History distinguishes an applied date range, shows the backend total, and lets users clear the filter; `src/utils/dates.ts` formats local dates in Spanish.
- Session refresh shares one request after an initial 401 or 403 and retries once. A failed refresh returns to Welcome; a subsequent 403 remains forbidden.

## Lessons learned and mistakes to avoid
- For local `formai-api`, set `JWT_COOKIE_SECURE=false`: iOS Simulator and Android Emulator do not send `Secure` cookies over HTTP. Android uses `10.0.2.2:8080`; iOS uses `localhost:8080`.
- Do not start independent refresh requests: reusing a rotated token can revoke sessions. Use `refreshSession` in `api-client.ts`.
- `className` works only on React Native core components. Android rejects `accessibilityRole="tabbar"`; use `tablist`.
- To build Android, set only `ANDROID_HOME=~/Library/Android/sdk` (without `ANDROID_SDK_ROOT`) and use JDK 17; run `adb reverse tcp:8081 tcp:8081` for Metro.

## Known limits
- On the first load from Metro, Welcome images may take a moment to appear on Android.
- Progress metrics and charts, reminders, and machine recognition are not yet implemented.

## Next steps
- Deliver the next increment: Progress metrics and charts, reminders, and machine recognition.
