# `screens/` — Pantallas

Cada archivo es una **pantalla completa** de la app: compone componentes de
`components/` y obtiene datos y acciones de `hooks/`. Es el punto donde se une la UI con el estado.

```
App
 │
 ▼
Navigation
 │
 ▼
Screens
 │
 ├──────────► Components
 │
 ▼
Hooks
 │
 ▼
Services
 │
 ▼
Backend/API
```

## Reglas

- Nombre `<Nombre>Screen.tsx` (p. ej. `TodayScreen.tsx`), exportado por nombre.
- **No llama a `services/` directamente**: usa un hook (`useClients`, `useTodayWorkout`…).
- Mantiene el markup de alto nivel; si un bloque se repite o crece, se extrae a `components/`.
- Cada ruta de `navigation/` apunta a una pantalla de esta carpeta.
- `WelcomeScreen` y `SignInScreen` son el acceso a la app.
- `ActivationCodeScreen` y `ActivationPasswordScreen` son los dos pasos de la activación de cuenta.
- `ForgotPasswordScreen`, `PasswordResetSentScreen` y `ResetPasswordScreen` son la recuperación de contraseña: pedir el enlace, la confirmación del envío y la nueva contraseña (o el aviso de enlace vencido) al abrir el enlace del correo.
- `TodayScreen`, `ProgressScreen` y `ProfileScreen` son las pestañas principales; su contenido es provisional hasta que llegue su feature.

## Ejemplo

```tsx
export function ClientsScreen() {
  const { clients, isLoading } = useClients();

  return isLoading ? <EmptyState title="Cargando…" /> : <ClientList clients={clients} />;
}
```
