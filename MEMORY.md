# MEMORY.md — FormAI Mobile App

## Estado actual (2026-10-02)
- `feature/mobile-auth` y `feature/mobile-training-flow` ya están integradas en `develop`; `feature/api-integration` conecta autenticación, entrenamiento, historial y perfil con recursos reales de `/api`.
- La app muestra Bienvenida, activación, inicio/cierre de sesión, recuperación por deep link, Hoy, rutina/día, resumen, historial/detalle y Perfil. No hay servicios simulados en los flujos actuales.
- Progreso lista sesiones y permite filtrar fechas; las métricas y los gráficos todavía pertenecen al siguiente incremento, junto con recordatorios y reconocimiento de máquinas.
- La renovación de sesión usa una sola petición compartida tras un 401 o 403 inicial y reintenta una vez. Si falla, vuelve a Bienvenida; un 403 posterior se conserva como rechazo.
- La auditoría frontend pasa con 0 errores y 0 advertencias. Lint y typecheck pasan; 13 suites y 77 tests pasan con `--watchman=false`.

## Decisiones
- Los DTO del backend mandan: estados `PENDING`, `COMPLETED`, `PARTIAL`, `SKIPPED`, días de descanso con campos nulos y sin métricas inventadas.
- Cada recurso usa su service mediante `apiClient`; recuperación, rutina vigente y sesiones tienen archivos separados. Los hooks de datos exponen `isLoading`, errores seguros en español y acciones de recarga.
- Los insets de pantalla y toast viven en primitivas de layout; las medidas de la bienvenida viven en UI. `tokens.css` no cambió.
- Los tests están en `__tests__/`; los flujos de activación, autenticación y recuperación prueban sus hooks mediante la app, y los hooks de carga tienen pruebas directas.

## Riesgos y cuidados
- Para formai-api local usar `JWT_COOKIE_SECURE=false`: iOS Simulator y Android Emulator no envían cookies `Secure` por HTTP. Android usa `10.0.2.2:8080`; iOS usa `localhost:8080`.
- No lanzar renovaciones independientes: la reutilización de un token rotado puede revocar las sesiones. Usar `refreshSession` en `api-client.ts`.
- `className` solo funciona en componentes core de React Native; Android rechaza `accessibilityRole="tabbar"` y usa `tablist`.
- Falta validar el resultado visual y la ejecución nativa en iOS y Android cuando haya simuladores disponibles.
