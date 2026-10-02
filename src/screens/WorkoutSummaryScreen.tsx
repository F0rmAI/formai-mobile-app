/**
 * Finished workout summary.
 *
 * @author Melina
 * @packageDocumentation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/layout';
import { WorkoutSummaryCard } from '@/components/training';
import { Badge, Button, EmptyState, Text } from '@/components/ui';
import { useWorkoutSession } from '@/hooks/useWorkoutSession';
import type { RootStackParamList } from '@/types/navigation';

/** Shows a completed or partial session using backend totals. */
export function WorkoutSummaryScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'WorkoutSummary'>) {
  const insets = useSafeAreaInsets();
  const { session, loading, error, retry } = useWorkoutSession(
    route.params.sessionId,
  );
  const completedSets =
    session?.exercises.reduce(
      (sum, exercise) => sum + exercise.sets.length,
      0,
    ) ?? 0;
  const targetSets =
    session?.exercises.reduce(
      (sum, exercise) => sum + exercise.targetSets,
      0,
    ) ?? 0;
  return (
    <View
      className="flex-1 gap-xl bg-surface-background"
      style={{ paddingTop: insets.top }}
    >
      <TopBar title="Resumen" onBack={navigation.goBack} />
      <View className="gap-xl p-xl">
        {loading ? (
          <EmptyState title="Cargando resumen" icon="hourglass_top" />
        ) : error ? (
          <EmptyState
            title="No pudimos cargar el resumen"
            action={{ label: 'Reintentar', onPress: retry }}
          />
        ) : session ? (
          <>
            <Text variant="headline">
              {session.status === 'PARTIAL'
                ? 'Sesión guardada como parcial'
                : session.status === 'COMPLETED'
                ? '¡Sesión completada!'
                : 'Resumen de sesión'}
            </Text>
            <Badge
              label={
                session.status === 'PARTIAL'
                  ? 'Parcial'
                  : session.status === 'COMPLETED'
                  ? 'Completada'
                  : session.status === 'SKIPPED'
                  ? 'Omitida'
                  : 'Pendiente'
              }
            />
            <WorkoutSummaryCard
              summary={{
                session,
                completedSets,
                targetSets,
                isPartial: completedSets < targetSets,
              }}
            />
            <Button
              label="Volver a Hoy"
              onPress={() => navigation.navigate('Main')}
            />
          </>
        ) : (
          <EmptyState title="Sesión no disponible" />
        )}
      </View>
    </View>
  );
}
