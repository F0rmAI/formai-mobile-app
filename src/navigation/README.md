# `navigation/` — Navegación

Define **qué pantalla se muestra y cómo se llega a ella** con React Navigation. Solo conecta
rutas con pantallas de `screens/`; no tiene UI propia ni lógica de negocio.

## Contenido base

| Archivo | Uso |
|---|---|
| `RootNavigator.tsx` | Navegación de primer nivel según la sesión (`useAuth`): sin sesión, bienvenida, inicio de sesión, activación y recuperación de contraseña; con sesión, las pestañas y los detalles de rutina e historial. Se monta en `App.tsx`. |
| `linking.ts` | Enlaces que abren una pantalla: el del correo de recuperación (`…/password-reset?token=…`) abre "Nueva contraseña". Se pasa a `NavigationContainer` en `App.tsx`. |
| `MainTabs.tsx` | Pestañas del cliente: Hoy, Progreso y Perfil (TB2 agrega Escanear). Usa el `BottomNav` del design system como barra. |

## Reglas

- Un archivo por navegador (`RootNavigator.tsx`, `MainTabs.tsx`…), exportado por nombre.
- Los parámetros de las rutas se tipan en `types/navigation.ts`.
- La barra y los headers se dibujan con `components/layout`; aquí solo se conectan con el estado del navegador.
- Las pantallas navegan con los hooks de React Navigation (`useNavigation`); no se pasan callbacks de ruta por props.

## Ejemplo

```tsx
const Tab = createBottomTabNavigator<MainTabParamList>();

<Tab.Navigator tabBar={renderTabBar} screenOptions={{ headerShown: false }}>
  <Tab.Screen name="Today" component={TodayScreen} />
</Tab.Navigator>
```
