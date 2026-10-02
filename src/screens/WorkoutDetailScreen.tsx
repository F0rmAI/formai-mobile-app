/**
 * Workout history detail screen.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/layout';
import { Badge, Card, EmptyState, Text } from '@/components/ui';
import { useWorkoutSession } from '@/hooks/useWorkoutSession';
import type { RootStackParamList } from '@/types/navigation';
import type { WorkoutStatus } from '@/types/training';

const labels: Record<WorkoutStatus, string> = {
  COMPLETED: 'Completada',
  PARTIAL: 'Parcial',
  SKIPPED: 'Omitida',
  PENDING: 'Pendiente',
};

/** Shows every exercise and recorded set in a historical session. */
export function WorkoutDetailScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'WorkoutDetail'>) {
  const insets = useSafeAreaInsets();
  const { session, loading, error, retry } = useWorkoutSession(
    route.params.sessionId,
  );
  return (
    <View
      className="flex-1 bg-surface-background"
      style={{ paddingTop: insets.top }}
    >
      <TopBar title="Detalle de sesión" onBack={navigation.goBack} />
      <ScrollView contentContainerClassName="gap-lg p-xl">
        {loading ? (
          <EmptyState title="Cargando sesión" icon="hourglass_top" />
        ) : error ? (
          <EmptyState
            title="No pudimos cargar la sesión"
            action={{ label: 'Reintentar', onPress: retry }}
          />
        ) : !session ? (
          <EmptyState title="Sesión no disponible" />
        ) : (
          <>
            <Text variant="headline">{session.dayLabel}</Text>
            <Text variant="body-m" tone="secondary">
              {session.scheduledFor} · Volumen total: {session.totalVolumeKg} kg
            </Text>
            <Badge label={labels[session.status]} />
            {session.exercises.map(exercise => (
              <Card key={exercise.exerciseId} className="gap-md">
                <Text variant="title">{exercise.exerciseName}</Text>
                <Text variant="body-m" tone="secondary">
                  Objetivo: {exercise.targetSets} series · {exercise.targetReps}{' '}
                  reps · {exercise.targetLoadKg} kg
                </Text>
                {exercise.sets.length === 0 ? (
                  <Text variant="body-m" tone="secondary">
                    Sin series registradas
                  </Text>
                ) : (
                  exercise.sets.map(set => (
                    <Text key={set.setNumber} variant="body-m">
                      Serie {set.setNumber}: {set.loadKg} kg · {set.reps} reps
                    </Text>
                  ))
                )}
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </View>
  );
}
