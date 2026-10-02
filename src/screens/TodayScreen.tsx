import { TabScreenLayout } from '@/components/layout';
import { EmptyState } from '@/components/ui';
import { useClientProfile } from '@/hooks/useClientProfile';
import { formatLongDate } from '@/utils/dates';

/** Pestaña Hoy. El contenido es provisional: la sesión del día llega con FE-MOB-009. */
export function TodayScreen() {
  const { firstName, headerUser } = useClientProfile();

  return (
    <TabScreenLayout
      headerSubtitle="Entrenamiento de hoy"
      user={headerUser}
      title={firstName ? `Hola, ${firstName}` : 'Hola'}
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
