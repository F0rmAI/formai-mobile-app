# MEMORY.md - FormAI Mobile App

Inter-session project memory. This file contains about 50 lines: summarize or remove content that no longer adds value.

## Current status (2026-10-01)
- `main` holds the project base: design tokens, 22 UI primitives, layout components (AppHeader, TopBar, BottomNav), API client, starter screen with a counter.
- The base passes the frontend audit (layers, tokens, TSDoc, tests): 0 errors, 0 warnings.
- Jest: 12 tests pass. ESLint validates TSDoc syntax.
- The base was run on the iOS simulator and the Android emulator on 2026-09-28; the changes since then are comments, tests and lint config only.
- Feature work lives in remote branches not merged into `main`: `feature/mobile-app-shell`, `feature/mobile-training-flow`.

## Decisions (and why)
- React Native 0.87.1 with the Community CLI, not Expo: the owner requires 0.87 and no Expo SDK targets it (SDK 57 uses 0.86, SDK 58 uses 0.88).
- React 19.3.0 although the RN 0.87 template pins 19.2.3: required by the owner, allowed by the peer range `^19.2.3`, and verified on both platforms.
- Uniwind for Tailwind v4: the stable binding for Tailwind 4; NativeWind 5 was still a release candidate.
- Fonts shipped as TTF named after their PostScript name: the same family name then works on iOS and Android.
- TSDoc in English with a per-file `@author` taken from git: one documentation standard for the whole team.

## Lessons learned and mistakes to avoid
- `className` is ignored by non-core components such as `SafeAreaView`; wrap them in a core `View`.
- Android rejects `accessibilityRole="tabbar"` at runtime; use `tablist`. Always run both platforms.
- `tokens.css` is shared with the web repo: never edit it in one repo only.
- Local machine: `ANDROID_SDK_ROOT` and `ANDROID_HOME` point to different SDKs and Gradle fails with both set; build with `ANDROID_HOME` only and JDK 17. `bundle install` cannot compile native gems here; use the global `pod install`.

## Next steps
- Merging the feature branches will conflict with `main` in `components/ui`, `components/layout` and `services/api-client.ts` (comments were rewritten).
- Audit the feature branches and align them with the documentation and layering rules.
- Choose camera, video and push libraries that support React Native 0.87 when those features start.
