# `components/` — Componentes reutilizables

Capa de **presentación pura**: componentes sin lógica de negocio que reciben datos por props y
avisan de las interacciones por callbacks (`onPress`, `onChange`…). Implementan el design system
de FormAI (Figma › `formai_design_system`).

## Estructura

| Carpeta | Contenido |
|---|---|
| `ui/` | Primitivos del design system: `Text`, `Icon`, `Button`, `IconButton`, `Badge`, `Chip`, `SectionLabel`, `Card`, `TextField`, `Checkbox`, `Toggle`, `ProgressBar`, `SegmentedControl`, `Toast`, `Dialog`, `Avatar`, `BrandLogo`, `EmptyState`, `ListItem`, `Callout`, `SectionHeader`, `TabItem`. **Misma API en web y mobile.** |
| `layout/` | Navegación y estructura propias de esta plataforma. |

### `layout/` en esta app

| Componente | Uso |
|---|---|
| `AppHeader` | Header principal con marca y avatar. |
| `TopBar` | Barra superior con botón volver y acción opcional. |
| `BottomNav` / `NavItem` | Navegación inferior (MVP: Hoy, Progreso, Perfil; TB2 agrega Escanear). |
| `TabScreenLayout` | Estructura de las pantallas con navegación inferior: header, título y contenido desplazable. |

## Reglas

- **Estilos solo con tokens** (`bg-primary`, `text-content-secondary`, `rounded-md`, `p-xl`, `shadow-card`…). Nada de colores hex ni tamaños sueltos: si falta un valor, se agrega primero a `src/tokens.css` (en ambos repos).
- **Color por defecto = primary.** Los componentes con tono o variante usan `primary` si no se indica otra cosa; el texto (`label`, `title`…) y el tono se cambian por props.
- Se construyen con primitivas de React Native (`View`, `Pressable`, `TextInput`…) con `className` de Uniwind y aceptan `className` para ajustes de layout; `cn()` resuelve los conflictos.
- No llaman a `services/` ni leen `context/`. Si un componente necesita datos, los recibe de la pantalla.
- Un componente por archivo, en `PascalCase.tsx`, exportado por nombre y registrado en el `index.ts` de su carpeta.
- Los componentes de dominio (p. ej. `SetRow`, `StatCard`, `WorkoutHistoryItem`) se crean en su rama de feature componiendo estos primitivos.

## Ejemplo

```tsx
import { Badge, Button } from '@/components/ui';

<Button label="Registrar serie" icon="check" variant="accent" onPress={onLog} />
<Badge label="Completado" tone="tertiary" icon="check" />
```
