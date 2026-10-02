/**
 * Workout history detail screen.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native';
import { ScreenContainer, TopBar } from '@/components/layout';
import { Badge, Card, EmptyState, Text } from '@/components/ui';
import { useWorkoutSession } from '@/hooks/useWorkoutSession';
import type { RootStackParamList } from '@/types/navigation';
import type { WorkoutStatus } from '@/types/training';
import { formatWorkoutHistoryDate } from '@/utils/dates';

const labels: Record<WorkoutStatus, string> = {
  COMPLETED: 'Completada',
  PARTIAL: 'Parcial',
  SKIPPED: 'Omitida',
  PENDING: 'Pendiente',
};

/** Shows recorded sets in a historical session using useWorkoutSession. */
export function WorkoutDetailScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'WorkoutDetail'>) {
  const { session, isLoading, error, retry } = useWorkoutSession(
    route.params.sessionId,
  );
  return (
    <ScreenContainer>
      <TopBar title="Detalle de sesión" onBack={navigation.goBack} />
      <ScrollView contentContainerClassName="gap-lg p-xl">
        {isLoading ? (
          <EmptyState title="Cargando sesión" icon="hourglass_top" />
        ) : error ? (
          <EmptyState
            title={error}
            action={{ label: 'Reintentar', onPress: retry }}
          />
        ) : !session ? (
          <EmptyState title="Sesión no disponible" />
        ) : (
          <>
            <Text variant="headline">{session.dayLabel}</Text>
            <Text variant="body-m" tone="secondary">
              {formatWorkoutHistoryDate(session.scheduledFor, 'detail')} · Volumen total: {session.totalVolumeKg} kg
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
    </ScreenContainer>
  );
}
