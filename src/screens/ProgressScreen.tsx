import { TabScreenLayout } from '@/components/layout';
import { EmptyState } from '@/components/ui';
import { useClientProfile } from '@/hooks/useClientProfile';

/** Pestaña Progreso. El contenido es provisional: las métricas llegan con FE-MOB-017. */
export function ProgressScreen() {
  const { headerUser } = useClientProfile();

  return (
    <TabScreenLayout
      headerSubtitle="Tu progreso"
      user={headerUser}
      title="Tu progreso"
    >
      <EmptyState
        icon="monitoring"
        title="Tus métricas"
        description="Aquí verás tu carga máxima, tu volumen semanal y tu historial de entrenamientos."
      />
    </TabScreenLayout>
  );
}
