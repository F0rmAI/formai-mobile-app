# `types/` — Tipos compartidos

Definiciones de **TypeScript compartidas** entre capas: modelos del dominio, DTO de la API y tipos
del design system.

## Contenido base

| Archivo | Uso |
|---|---|
| `ui.ts` | Variantes del design system (`ButtonVariant`, `BadgeTone`, `TextVariant`…). Mismo contenido en web y mobile, para que ambos expongan la misma API de componentes. |
| `auth.ts` | Cuenta autenticada y datos del inicio de sesión. |
| `client-profile.ts` | Datos propios del cliente con sesión (nombre y correo). |
| `account-activation.ts` | Datos de la verificación del código y de la activación de cuenta. |
| `navigation.ts` | Parámetros de las rutas de React Navigation (`RootStackParamList`, `MainTabParamList`). |
| `training.ts` | DTO de rutina vigente y sesiones, estados del backend y tipos de registro. |
| `assets.d.ts` | Tipos para importar `*.css` y `*.png`. |
| `uniwind-types.d.ts` | **Generado por Uniwind** al iniciar Metro: no se edita a mano, pero se versiona para que TypeScript funcione en un clon limpio. |

## Reglas

- Solo tipos (`type` / `interface`); sin lógica.
- Un archivo por dominio: `client.ts`, `routine.ts`, `workout.ts`, `machine.ts`.
- Los tipos que solo usa un componente se declaran en su archivo (p. ej. `ButtonProps`).

## Ejemplo

```ts
export interface Client {
  id: string;
  fullName: string;
  status: 'ACTIVE' | 'INACTIVE';
}
```
