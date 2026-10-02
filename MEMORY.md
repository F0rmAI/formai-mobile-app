# MEMORY.md — FormAI Mobile App

## Estado actual (2026-10-02)
- `feature/mobile-auth` y `feature/mobile-training-flow` ya están integradas en `develop`; `feature/api-integration` conecta autenticación, entrenamiento, historial y perfil con recursos reales de `/api`.
- La app muestra Bienvenida, activación, inicio/cierre de sesión, recuperación por deep link, Hoy, rutina/día, resumen, historial/detalle y Perfil. No hay servicios simulados en los flujos actuales.
- Progreso lista sesiones y permite filtrar fechas; las métricas y los gráficos todavía pertenecen al siguiente incremento, junto con recordatorios y reconocimiento de máquinas.
- La renovación de sesión usa una sola petición compartida tras un 401 o 403 inicial y reintenta una vez. Si falla, vuelve a Bienvenida; un 403 posterior se conserva como rechazo.
- Tras los ajustes del simulador: auditoría frontend PASS (0 errores, 0 advertencias), lint y typecheck pasan; Jest pasa con `--watchman=false` (14 suites, 84 tests).

## Decisiones
- Los DTO del backend mandan: estados `PENDING`, `COMPLETED`, `PARTIAL`, `SKIPPED`, días de descanso con campos nulos y sin métricas inventadas.
- Cada recurso usa su service mediante `apiClient`; recuperación, rutina vigente y sesiones tienen archivos separados. Los hooks de datos exponen `isLoading`, errores seguros en español y acciones de recarga.
- Los insets de pantalla y toast viven en primitivas de layout; las medidas de la bienvenida viven en UI. `tokens.css` no cambió.
- Los tests están en `__tests__/`; los flujos de activación, autenticación y recuperación prueban sus hooks mediante la app, y los hooks de carga tienen pruebas directas.
- El diálogo usa un fondo táctil hermano del panel para que VoiceOver alcance título, descripción y botones. Los iconos decorativos se ocultan a accesibilidad y Button anuncia su etiqueta.
- El historial distingue un rango aplicado, muestra el total del backend y permite quitar el filtro; la fecha local se formatea en español desde `src/utils/dates.ts`.

## Riesgos y cuidados
- Para formai-api local usar `JWT_COOKIE_SECURE=false`: iOS Simulator y Android Emulator no envían cookies `Secure` por HTTP. Android usa `10.0.2.2:8080`; iOS usa `localhost:8080`.
- No lanzar renovaciones independientes: la reutilización de un token rotado puede revocar las sesiones. Usar `refreshSession` en `api-client.ts`.
- `className` solo funciona en componentes core de React Native; Android rechaza `accessibilityRole="tabbar"` y usa `tablist`.
- Tras estos ajustes de UI falta repetir la validación nativa en iOS y Android cuando haya simuladores disponibles.
