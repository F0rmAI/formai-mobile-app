/**
 * Client profile screen.
 *
 * @author Carlos
 * @packageDocumentation
 */

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { TabScreenLayout } from '@/components/layout';
import { Button, Card, Dialog, ListItem, Text, Toast } from '@/components/ui';
import { useActiveRoutine } from '@/hooks/useActiveRoutine';
import { useClientProfile } from '@/hooks/useClientProfile';
import { useSignOut } from '@/hooks/useSignOut';
import type { MainTabParamList, RootStackParamList } from '@/types/navigation';

/** Shows profile and routine data using useClientProfile, useActiveRoutine and useSignOut. */
export function ProfileScreen({
  navigation,
}: {
  navigation: BottomTabNavigationProp<MainTabParamList, 'Profile'>;
}) {
  const { isConfirming, isSigningOut, error, requestSignOut, cancel, confirm } =
    useSignOut();
  const { profile, headerUser } = useClientProfile();
  const {
    routine,
    isLoading,
    error: routineError,
    retry,
  } = useActiveRoutine('No pudimos cargar tu rutina.');
  const root =
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <TabScreenLayout
      headerSubtitle="Tu cuenta"
      user={headerUser}
      title="Perfil"
    >
      <Card className="gap-sm">
        <Text variant="title">{profile?.fullName ?? 'Cargando perfil'}</Text>
        <Text variant="body-m" tone="secondary">
          {profile?.email ?? ''}
        </Text>
      </Card>
      {routineError && <Toast message={routineError} tone="error" />}
      <ListItem
        title="Mi rutina vigente"
        subtitle={
          isLoading
            ? 'Cargando...'
            : routine?.routineName ?? 'Sin rutina asignada'
        }
        onPress={() => (routine ? root?.navigate('Routine') : retry())}
        showChevron={Boolean(routine)}
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
