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
y consentimiento) son los primeros ejemplos: la pantalla solo pinta lo que devuelven.
