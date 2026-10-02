/**
 * Workout history screen.
 *
 * @author Carlos
 * @packageDocumentation
 */

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { TabScreenLayout } from '@/components/layout';
import {
  Button,
  EmptyState,
  ListItem,
  TextField,
  Toast,
} from '@/components/ui';
import { useClientProfile } from '@/hooks/useClientProfile';
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory';
import type { MainTabParamList, RootStackParamList } from '@/types/navigation';
import type { WorkoutStatus } from '@/types/training';

const labels: Record<WorkoutStatus, string> = {
  COMPLETED: 'Completada',
  PARTIAL: 'Parcial',
  SKIPPED: 'Omitida',
  PENDING: 'Pendiente',
};

/** Lists workouts using useWorkoutHistory for filtering and pagination. */
export function ProgressScreen({
  navigation,
}: {
  navigation: BottomTabNavigationProp<MainTabParamList, 'Progress'>;
}) {
  const { headerUser } = useClientProfile();
  const {
    from,
    to,
    setFrom,
    setTo,
    sessions,
    isLoading,
    error,
    applyFilter,
    retry,
    loadMore,
    hasMore,
  } = useWorkoutHistory();
  const root =
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
  return (
    <TabScreenLayout
      headerSubtitle="Tu historial"
      user={headerUser}
      title="Historial de entrenamientos"
    >
      <View className="gap-md">
        <TextField
          label="Desde (yyyy-MM-dd)"
          value={from}
          onChangeText={setFrom}
          autoCapitalize="none"
        />
        <TextField
          label="Hasta (yyyy-MM-dd)"
          value={to}
          onChangeText={setTo}
          autoCapitalize="none"
        />
        <Button label="Filtrar" onPress={applyFilter} />
      </View>
      {error && <Toast message={error} tone="error" />}
      {isLoading && sessions.length === 0 ? (
        <EmptyState title="Cargando historial" icon="hourglass_top" />
      ) : sessions.length === 0 ? (
        <EmptyState
          title="Aún no hay entrenamientos"
          description="Tus sesiones aparecerán aquí cuando tengas una rutina."
          icon="event_busy"
          action={error ? { label: 'Reintentar', onPress: retry } : undefined}
        />
      ) : (
        <View className="gap-sm">
          {sessions.map(session => (
            <ListItem
              key={session.id}
              title={session.dayLabel}
              subtitle={`${session.scheduledFor} · ${session.totalVolumeKg} kg`}
              badge={labels[session.status]}
              onPress={() =>
                root?.navigate('WorkoutDetail', { sessionId: session.id })
              }
            />
          ))}
        </View>
      )}
      {hasMore && (
        <Button label="Cargar más" loading={isLoading} onPress={loadMore} />
      )}
    </TabScreenLayout>
  );
}
