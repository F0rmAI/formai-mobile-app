import { TabScreenLayout } from '@/components/layout';
import { EmptyState } from '@/components/ui';
import { formatLongDate } from '@/utils/dates';

/**
 * Pestaña Hoy. El contenido es provisional: la sesión del día llega con
 * FE-MOB-009 y el saludo con el nombre del cliente, con la autenticación.
 */
export function TodayScreen() {
  return (
    <TabScreenLayout
      headerSubtitle="Entrenamiento de hoy"
      title="Hola"
      subtitle={formatLongDate(new Date())}
    >
      <EmptyState
        icon="fitness_center"
        title="Tu sesión del día"
        description="Aquí verás la sesión que te toca hoy y su avance."
      />
    </TabScreenLayout>
  );
}
