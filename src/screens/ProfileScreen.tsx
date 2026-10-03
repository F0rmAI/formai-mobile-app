/**
 * Client profile screen.
 *
 * @author Carlos
 * @packageDocumentation
 */

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { TabScreenLayout } from '@/components/layout';
import {
  Avatar,
  Button,
  Card,
  Dialog,
  ListItem,
  Text,
  Toast,
} from '@/components/ui';
import { useActiveRoutine } from '@/hooks/useActiveRoutine';
import { useClientProfile } from '@/hooks/useClientProfile';
import { useReminders } from '@/hooks/useReminders';
import { useSignOut } from '@/hooks/useSignOut';
import type { MainTabParamList, RootStackParamList } from '@/types/navigation';

/** Shows profile, routine, reminders entry and confirmed sign-out. */
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
  const { summarySubtitle, summaryBadge } = useReminders();
  const root =
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

  const dayCount = routine?.trainingDays.length ?? 0;
  const routineSubtitle = isLoading
    ? 'Cargando...'
    : routine
      ? `${routine.routineName} · ${dayCount} ${dayCount === 1 ? 'día' : 'días'}`
      : 'Sin rutina asignada';

  return (
    <TabScreenLayout
      headerSubtitle="Tu cuenta"
      user={headerUser}
      title="Perfil"
    >
      <Card>
        <View className="flex-row items-center gap-md">
          <Avatar name={profile?.fullName ?? 'Cliente'} size="md" />
          <View className="flex-1 gap-2xs">
            <Text variant="title">{profile?.fullName ?? 'Cargando perfil'}</Text>
            <Text variant="body-m" tone="secondary">
              {profile?.email ?? ''}
            </Text>
          </View>
        </View>
      </Card>
      {routineError && <Toast message={routineError} tone="error" />}
      <ListItem
        icon="event_note"
        title="Mi rutina vigente"
        subtitle={routineSubtitle}
        onPress={() => (routine ? root?.navigate('Routine') : retry())}
        showChevron={Boolean(routine)}
      />
      <ListItem
        icon="notifications"
        title="Recordatorios"
        subtitle={summarySubtitle}
        badge={summaryBadge}
        badgeTone="tertiary"
        onPress={() => root?.navigate('Reminders')}
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
