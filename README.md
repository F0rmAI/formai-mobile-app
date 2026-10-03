# FormAI Mobile App

Aplicación iOS y Android para clientes de gimnasios que entrenan con una rutina asignada. Es un proyecto bare de React Native 0.87.1 (Community CLI) con React 19.3.0, TypeScript y Tailwind CSS 4.3.3 mediante Uniwind. No usa Expo.

Las ramas `feature/mobile-auth` y `feature/mobile-training-flow` ya fueron integradas en `develop`. Esta rama, `feature/api-integration`, conecta los flujos con el backend real bajo `/api`; las pantallas actuales no usan datos simulados.

## Funciones disponibles

- Bienvenida, activación con código del entrenador, consentimiento, inicio y cierre de sesión.
- Recuperación de contraseña mediante un enlace que abre la app.
- Pestaña **Hoy**: rutina vigente, día de descanso o sesión programada; registro y corrección de series; confirmación de sesión completa o parcial; resumen final.
- Detalle de la rutina vigente y de cada día prescrito.
- Pestaña **Progreso**: historial paginado, filtro por rango de fechas y detalle de cada sesión.
- Pestaña **Perfil**: nombre y correo del backend, rutina vigente, recordatorios locales y cierre de sesión confirmado.
- **Recordatorios** (on-device): toggle, hora del aviso y preview; prefs en AsyncStorage y Notifee (no hay endpoint de recordatorios en la API).
- Renovación compartida de sesión: ante el primer HTTP 401 o 403 de una solicitud autenticada, se renuevan las cookies y se reintenta una vez. Si falla la renovación, la app vuelve a Bienvenida. Un 403 después del reintento sigue siendo una respuesta de acceso denegado.

**Siguiente incremento:** reconocimiento de máquinas con cámara, alternativas y guías.

## Arquitectura

```text
App → Navigation → Screens → Components
                         │
                         ▼
                       Hooks → Services → Backend /api
```

`src/components/ui` contiene los primitivos del design system; `src/components/layout` contiene los contenedores y la navegación propios de mobile. Las pantallas componen componentes y consumen hooks; los hooks manejan estado y llaman a services; solo los services usan `apiClient`. `src/context` comparte la sesión y el perfil entre pantallas. Cada capa tiene un `README.md` con sus reglas. `src/tokens.css` es compartido byte por byte con la app web y no se debe cambiar solo en este repositorio.

## Desarrollo con formai-api local

Requisitos: Node.js ≥ 22.11.0, Xcode y CocoaPods para iOS, o Android Studio y JDK 17 para Android. Instala las dependencias ya declaradas con `npm install` si aún no están disponibles. La API debe estar activa en el puerto 8080 y atender `/api`.

Configura **`JWT_COOKIE_SECURE=false` al iniciar formai-api local**. iOS Simulator y Android Emulator acceden al backend por HTTP y no envían cookies marcadas `Secure`; sin esa configuración, el inicio y la renovación de sesión no funcionan. En desarrollo, [`src/services/config.ts`](src/services/config.ts) usa `http://localhost:8080/api` en iOS Simulator y `http://10.0.2.2:8080/api` en Android Emulator. Para un dispositivo físico, configura una dirección alcanzable desde ese dispositivo antes de ejecutar la app.

```bash
npm start
npm run ios       # o npm run android
npm run typecheck
npm run lint
npm test -- --watchman=false
```

Después de agregar una dependencia nativa en iOS, ejecuta `cd ios && bundle exec pod install`. Los archivos de prueba viven en `__tests__/`; Jest simula los módulos nativos necesarios y no requiere red.

## Enlace de recuperación de contraseña

El correo contiene `…/password-reset?token=…`. [`src/navigation/linking.ts`](src/navigation/linking.ts) acepta `formai://password-reset?token=…` y `https://formai.app/password-reset?token=…` y abre **Nueva contraseña**. Para probar el esquema local:

```bash
xcrun simctl openurl booted 'formai://password-reset?token=<token>'
adb shell am start -a android.intent.action.VIEW -d 'formai://password-reset?token=<token>'
```

El enlace HTTPS requiere la asociación de dominio de iOS y `/.well-known/assetlinks.json` en Android para abrir directamente la app. Si el backend local genera un enlace web, copia el token y usa el esquema `formai://` para probar el flujo en el simulador o emulador.
