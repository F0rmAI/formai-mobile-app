# `hooks/` — Hooks personalizados

Contienen la **lógica de estado y de casos de uso** de la UI: llaman a `services/`, manejan carga,
errores y estado local, y exponen a las pantallas una API simple.

## Reglas

- Nombre `use<Algo>.ts` (camelCase con prefijo `use`), exportado por nombre.
- Pueden usar `services/`, `context/`, `utils/` y `types/`. **Nunca** importan componentes.
- Devuelven datos listos para pintar (`{ data, isLoading, error, refetch }`) y acciones (`logSet`, `finishSession`…).
- Un hook por caso de uso; si crece, se divide.

## Ejemplo

```ts
export function useClients() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    clientsService.list().then(setClients);
  }, []);

  return { clients };
}
```

`useActivationCode.ts` (verifica el código del entrenador) y `useAccountActivation.ts` (correo, contraseña
y consentimiento), `useForgotPassword.ts` (pide el enlace de recuperación), `useResetPassword.ts` (nueva contraseña con el token del enlace), `useMailApp.ts` (abre el correo del cliente: su app o la bandeja web), `useSignIn.ts` (formulario de inicio de sesión), `useClientProfile.ts` (nombre del cliente con sesión) y `useSignOut.ts` (cierre con confirmación) son los primeros ejemplos: la pantalla solo pinta lo que devuelven.

`useTraining.ts` gestiona la sesión de hoy; `useActiveRoutine.ts` carga la rutina; `useWorkoutHistory.ts` maneja filtro y paginación; `useWorkoutSession.ts` carga detalles y resúmenes.
