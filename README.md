# FormAI Mobile App

Aplicación iOS y Android para clientes de gimnasios que entrenan con una rutina asignada. Es un proyecto bare de React Native 0.87.1 (Community CLI) con React 19.3.0, TypeScript y Tailwind CSS 4.3.3 mediante Uniwind. No usa Expo.

Las ramas `feature/mobile-auth` y `feature/mobile-training-flow` ya fueron integradas en `develop`. La app conecta los flujos con el backend real bajo `/api`; las pantallas actuales no usan datos simulados.

## Funciones disponibles

- Bienvenida, activación con código del entrenador, consentimiento, inicio y cierre de sesión.
- Recuperación de contraseña mediante un enlace que abre la app.
- Pestaña **Hoy**: rutina vigente, día de descanso o sesión programada; registro y corrección de series; confirmación de sesión completa o parcial; resumen final.
- Detalle de la rutina vigente y de cada día prescrito.
- Pestaña **Progreso**: historial paginado, filtro por rango de fechas y detalle de cada sesión.
- Pestaña **Perfil**: nombre y correo del backend, rutina vigente, recordatorios locales y cierre de sesión confirmado.
- **Recordatorios** (on-device): toggle, hora del aviso y preview; prefs en AsyncStorage y Notifee (no hay endpoint de recordatorios en la API).
- Renovación compartida de sesión: ante el primer HTTP 401 o 403 de una solicitud autenticada, se renuevan las cookies y se reintenta una vez. Si falla la renovación, la app abre Inicio de sesión y explica que la sesión expiró. Un 403 después del reintento sigue siendo una respuesta de acceso denegado.

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

Configura **`JWT_COOKIE_SECURE=false` al iniciar formai-api local** (el valor predeterminado del backend es `true`). Los almacenes de cookies nativos de iOS y Android descartan las cookies `Secure` sobre HTTP; un inicio de sesión puede responder 200 y aun así no conservar la sesión. Navegadores y `curl` tratan `localhost` como seguro, por eso la web puede funcionar con la misma configuración. En producción, conserva `JWT_COOKIE_SECURE=true` y usa HTTPS. La URL de la API se define con `API_URL` en `.env` al compilar; si falta o está vacía, [`src/services/config.ts`](src/services/config.ts) usa `http://localhost:8080/api/v1` en iOS Simulator, `http://10.0.2.2:8080/api/v1` en Android Emulator, solo para debug. En release, `API_URL` es obligatorio y se inyecta al compilar; la app falla al iniciar si falta.

```bash
npm start
npm run ios       # o npm run android
npm run typecheck
npm run lint
npm test -- --watchman=false
```

Si Xcode no encuentra Node, crea `ios/.xcode.env` localmente con `NODE_BINARY`; ese archivo no se versiona. Después de agregar una dependencia nativa en iOS, ejecuta `cd ios && bundle exec pod install`. Los archivos de prueba viven en `__tests__/`; Jest simula los módulos nativos necesarios y no requiere red.

## Ejecutar en un teléfono Android físico

Conecta el teléfono a la misma red Wi-Fi que la Mac y permite el puerto 8080 en el firewall de macOS. Comprueba que formai-api escuche en la red local, no solo en `127.0.0.1`, y ejecútala con `JWT_COOKIE_SECURE=false`. Crea un `.env` local y escribe la IP LAN de la Mac (por ejemplo, `API_URL=http://192.168.1.20:8080/api/v1`). `.env` no se versiona; la URL queda incorporada al bundle al compilar.

```bash
# Crea .env localmente con API_URL para tu dispositivo.
npx react-native start --reset-cache
```

Con la depuración USB habilitada y el teléfono conectado, instala la versión debug en otra terminal:

```bash
npm run android
```

Para un APK release de demostración local, compila e instala con tráfico HTTP y firma de depuración habilitados expresamente:

```bash
cd android
./gradlew assembleRelease -PformaiAllowCleartext=true -PformaiUseDebugSigning=true
cd ..
adb install -r android/app/build/outputs/apk/release/app-release.apk
```

El release normal mantiene el tráfico HTTP deshabilitado y requiere una firma de producción. Para producción, proporciona `API_URL` mediante la configuración privada del build con un endpoint HTTPS y configura `FORMAI_RELEASE_STORE_FILE`, `FORMAI_RELEASE_STORE_PASSWORD`, `FORMAI_RELEASE_KEY_ALIAS` y `FORMAI_RELEASE_KEY_PASSWORD` fuera del repositorio. Compila sin las opciones `-PformaiAllowCleartext=true` ni `-PformaiUseDebugSigning=true`. iOS requiere certificados y perfil de aprovisionamiento en el entorno de distribución. Al cambiar `.env`, reinicia Metro con `npx react-native start --reset-cache` para debug y vuelve a compilar el APK para release.

Como alternativa por USB, ejecuta `adb reverse tcp:8080 tcp:8080`, coloca `API_URL=http://localhost:8080/api/v1` en `.env` y vuelve a compilar. El reenvío requiere que el teléfono siga conectado por USB; para Wi-Fi usa la IP LAN.

## Enlace de recuperación de contraseña

El correo contiene `…/password-reset?token=…`. [`src/navigation/linking.ts`](src/navigation/linking.ts) acepta `formai://password-reset?token=…` y `https://formai.app/password-reset?token=…` y abre **Nueva contraseña**. Para probar el esquema local:

```bash
xcrun simctl openurl booted 'formai://password-reset?token=<token>'
adb shell am start -a android.intent.action.VIEW -d 'formai://password-reset?token=<token>'
```

El enlace HTTPS requiere la asociación de dominio de iOS y `/.well-known/assetlinks.json` en Android para abrir directamente la app. Si el backend local genera un enlace web, copia el token y usa el esquema `formai://` para probar el flujo en el simulador o emulador.
