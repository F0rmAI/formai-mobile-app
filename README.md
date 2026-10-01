# FormAI Mobile App

## Summary

**FormAI** es una plataforma de seguimiento de entrenamientos personalizados en gimnasios que conecta
a **entrenadores personales** con sus **clientes**. Centraliza la gestión de la cartera de atletas, la
prescripción de rutinas y el registro en tiempo real de lo que se ejecuta, y reemplaza las hojas de
cálculo y los chats informales. Su diferenciador es un módulo de **IA que reconoce máquinas de gimnasio
por foto** y muestra guías de uso animadas.

Este repositorio es la **aplicación móvil (iOS / Android)** para el **cliente o atleta** que entrena
con un plan personalizado y necesita autonomía en el gimnasio.

### Ecosistema FormAI

| Repositorio | Qué es | Quién lo usa |
|---|---|---|
| `formai-mobile-app` (este) | App React Native (iOS/Android) | Cliente / atleta |
| `formai-web-app` | SPA React servida por Caddy | Entrenador · Administrador |
| `formai-api` | Backend Spring Boot (monolito modular DDD) | Ambas apps vía `/api` |

## Stack

| Capa | Tecnología | Versión |
|---|---|---|
| Framework | React Native (Community CLI, New Architecture, Hermes) | **0.87.1** |
| UI | React | **19.3.0** |
| Estilos | Tailwind CSS + Uniwind (bindings de Tailwind v4 para React Native) | **4.3.3** / 1.12 |
| Lenguaje | TypeScript | 6.0 |
| Bundler | Metro | 0.87 |
| Tests / lint | Jest + react-test-renderer · ESLint (`@react-native/eslint-config`) + Prettier | — |
| Navegación | React Navigation (`native-stack`, `bottom-tabs`) + `react-native-screens` | 7.x / 4.x |
| Safe area | `react-native-safe-area-context` | 5.x |
| Tipografía | Plus Jakarta Sans (TTF 400/600/700/800) | — |
| Íconos | Material Symbols Rounded (TTF por ligaduras, peso 400) | — |
| Utilidades de clases | `clsx` + `tailwind-merge` | 2.1 / 3.7 |
| Backend (contexto) | Spring Boot · PostgreSQL · Caddy (HTTPS, `/api`, `/media`) | — |

> Se usa la **Community CLI** según la guía oficial *Get Started Without a Framework*, porque ningún SDK
> de Expo trabaja sobre React Native 0.87. Los módulos de cámara, video y notificaciones se eligen en
> sus ramas de feature, entre librerías compatibles con 0.87.

## Features

- **Activación de cuenta** con el código de invitación de 72 h del entrenador, definición de contraseña y consentimiento obligatorio para datos personales y de salud (Ley N.° 29733).
- **Rutina del día**: sesión programada con ejercicios, series, cargas objetivo y descansos; detalle de cualquier otra sesión.
- **Registro de entrenamiento**: carga (kg) y repeticiones reales por serie, con corrección antes de cerrar.
- **Cierre de sesión** como **Completada** o **Parcial**; marcado automático como **Omitida** si el día termina sin registros.
- **Historial y progreso**: entrenamientos pasados por serie, volumen acumulado y gráficos de evolución.
- **Recordatorios push** de sesiones pendientes.
- **Reconocimiento de máquinas con IA**: foto con la cámara → máquina identificada y nivel de confianza.
- **Fallback**: si la confianza es menor a 0,70 o la foto es ilegible, se muestran las 3 opciones más probables y un buscador manual.
- **Guía animada** (MP4 ≤ 30 s en streaming) junto con los datos del ejercicio de la rutina.
- **Indicaciones de texto**: hasta 4 pasos clave y 2 errores comunes, indicando qué requiere supervisión profesional.
- **Retroalimentación**: el cliente confirma o corrige la máquina reconocida para mejorar el modelo.

## Arquitectura

```
src/
├── components/   ui/ (design system) + layout/ (AppHeader, TopBar, BottomNav, TabScreenLayout)
├── screens/      pantallas completas
├── navigation/   navegadores de React Navigation (pestañas…)
├── hooks/        estado y casos de uso de la UI
├── services/     acceso al backend (apiClient + config)
├── context/      estado global (sesión…)
├── utils/        funciones puras (cn…)
├── types/        tipos compartidos
├── assets/       imágenes estáticas (isotipo)
├── tokens.css    design tokens de FormAI (idéntico en web y mobile)
├── global.css    Tailwind + Uniwind + tokens + fuentes
└── App.tsx       providers + navegación (registrado en index.js)
assets/fonts/     TTF enlazados en iOS y Android (react-native.config.js)
```

```
App ──► Navigation ──► Screens ──► Components
                          │
                          ▼
                        Hooks ──► Services ──► Backend/API
```

Cada carpeta tiene un `README.md` que explica para qué sirve la capa, qué va y qué no, y un ejemplo:
[components](src/components/README.md) · [screens](src/screens/README.md) · [navigation](src/navigation/README.md) · [hooks](src/hooks/README.md) ·
[services](src/services/README.md) · [context](src/context/README.md) · [utils](src/utils/README.md) ·
[types](src/types/README.md).

## Design system

- Fuente: Figma **FormAI › `formai_design_system`** (Foundations + Components).
- `src/tokens.css` define los tokens como variables `@theme` de Tailwind v4 (el mismo archivo que la web): colores (`bg-primary`, `text-content-secondary`, `border-line-subtle`…), tipografía (`text-title`, `text-body-l`…), radios (`rounded-md`), espaciado (`p-xl`, `gap-md`) y elevación (`shadow-card`, `shadow-glow-primary`).
- Uniwind compila esas clases en build time y agrega `className` a los componentes de React Native.
- Los componentes de `components/ui` tienen **la misma API que en la web** (en mobile el evento es `onPress`) y usan **`primary` como color por defecto**.
- En React Native cada peso tipográfico es una familia (`font-sans`, `font-sans-semibold`, `font-sans-bold`, `font-sans-extrabold`): usa siempre `<Text variant="…">`.
- Íconos por ligadura: `<Icon name="fitness_center" />`.

## Primeros pasos

Requisitos: Node.js ≥ 22.13, Xcode + CocoaPods (iOS) y Android Studio con JDK 17 (Android).
Sigue la guía oficial [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment).

```bash
npm install

# iOS
bundle install && (cd ios && bundle exec pod install)   # o: (cd ios && pod install)
npm run ios

# Android
npm run android

# Metro (si no se abrió solo)
npm start
```

Al iniciar verás la **bienvenida**; después de iniciar sesión, la pestaña **Hoy** y la barra inferior
para moverte entre **Hoy**, **Progreso** y **Perfil**. El contenido de cada pestaña es provisional hasta que llegue su feature.

| Script | Qué hace |
|---|---|
| `npm start` | Inicia Metro. |
| `npm run ios` / `npm run android` | Compila e instala la app en simulador o emulador. |
| `npm test` | Tests con Jest. |
| `npm run lint` | ESLint + Prettier. |
| `npm run typecheck` | `tsc --noEmit`. |

### Agregar una fuente

1. Copia el `.ttf` a `assets/fonts/` (nombre del archivo = nombre PostScript).
2. Ejecuta `npx react-native-asset`.
3. Declárala en el bloque `@theme` de `src/global.css`.
