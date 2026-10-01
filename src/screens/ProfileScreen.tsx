import { TabScreenLayout } from '@/components/layout';
import { EmptyState } from '@/components/ui';

/** Pestaña Perfil. El contenido es provisional: los datos de la cuenta llegan con FE-MOB-023. */
export function ProfileScreen() {
  return (
    <TabScreenLayout headerSubtitle="Tu cuenta" title="Perfil">
      <EmptyState
        icon="person"
        title="Tu cuenta"
        description="Aquí verás tus datos, tu entrenador y tu rutina vigente."
      />
    </TabScreenLayout>
  );
}
