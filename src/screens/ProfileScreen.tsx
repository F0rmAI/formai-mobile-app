import { TabScreenLayout } from '@/components/layout';
import { Button, Dialog, EmptyState, Toast } from '@/components/ui';
import { useSignOut } from '@/hooks/useSignOut';

/**
 * Pestaña Perfil. Los datos de la cuenta son provisionales (llegan con FE-MOB-023);
 * el cierre de sesión ya es definitivo.
 */
export function ProfileScreen() {
  const { isConfirming, isSigningOut, error, requestSignOut, cancel, confirm } =
    useSignOut();

  return (
    <TabScreenLayout headerSubtitle="Tu cuenta" title="Perfil">
      <EmptyState
        icon="person"
        title="Tu cuenta"
        description="Aquí verás tus datos, tu entrenador y tu rutina vigente."
      />
      {error && <Toast message={error} tone="error" />}
      <Button
        label="Cerrar sesión"
        icon="logout"
        variant="secondary"
        fullWidth
        loading={isSigningOut}
        onPress={requestSignOut}
      />
      <Dialog
        open={isConfirming}
        icon="logout"
        title="¿Cerrar sesión?"
        description="Tendrás que ingresar tu correo y contraseña para volver a entrar."
        confirmLabel="Cerrar sesión"
        confirmIcon="logout"
        onConfirm={confirm}
        onCancel={cancel}
      />
    </TabScreenLayout>
  );
}
