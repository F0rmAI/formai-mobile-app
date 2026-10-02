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
  Text,
  Toast,
} from '@/components/ui';
import { useClientProfile } from '@/hooks/useClientProfile';
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory';
import type { MainTabParamList, RootStackParamList } from '@/types/navigation';
import type { WorkoutStatus } from '@/types/training';
import { formatWorkoutHistoryDate } from '@/utils/dates';

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
    totalElements,
    isFiltered,
    isLoading,
    error,
    applyFilter,
    clearFilter,
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
          label="Desde"
          helper="aaaa-mm-dd"
          placeholder="aaaa-mm-dd"
          value={from}
          onChangeText={setFrom}
          autoCapitalize="none"
        />
        <TextField
          label="Hasta"
          helper="aaaa-mm-dd"
          placeholder="aaaa-mm-dd"
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
          title={
            isFiltered
              ? 'Sin entrenamientos en este rango'
              : 'Aún no hay entrenamientos'
          }
          description={
            isFiltered
              ? undefined
              : 'Tus sesiones aparecerán aquí cuando tengas una rutina.'
          }
          icon="event_busy"
          action={
            isFiltered
              ? { label: 'Quitar filtro', onPress: clearFilter }
              : error
              ? { label: 'Reintentar', onPress: retry }
              : undefined
          }
        />
      ) : (
        <View className="gap-sm">
          {isFiltered && (
            <Text variant="body-m" tone="secondary">
              {`${totalElements} ${
                totalElements === 1 ? 'entrenamiento' : 'entrenamientos'
              } en este rango`}
            </Text>
          )}
          {sessions.map(session => (
            <ListItem
              key={session.id}
              title={session.dayLabel}
              subtitle={`${formatWorkoutHistoryDate(
                session.scheduledFor,
                'list',
              )} · ${session.totalVolumeKg} kg`}
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
