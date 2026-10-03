/**
 * Workout history detail screen.
 *
 * @author Christian
 * @packageDocumentation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, View } from 'react-native';
import { SetSummaryTile } from '@/components/progress';
import { ScreenContainer, TopBar } from '@/components/layout';
import { Badge, Card, EmptyState, Icon, Text } from '@/components/ui';
import { useWorkoutSession } from '@/hooks/useWorkoutSession';
import type { RootStackParamList } from '@/types/navigation';
import type { WorkoutStatus } from '@/types/training';
import { formatTime, formatWorkoutHistoryDate } from '@/utils/dates';
import { formatVolumeKg, workoutStatusLabel } from '@/utils/progress';

const badgeTone: Record<
  WorkoutStatus,
  'tertiary' | 'secondary' | 'neutral' | 'primary'
> = {
  COMPLETED: 'tertiary',
  PARTIAL: 'secondary',
  SKIPPED: 'neutral',
  PENDING: 'primary',
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
      <TopBar title="Detalle" onBack={navigation.goBack} />
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
            <Card className="gap-md">
              <View className="flex-row items-center justify-between gap-md">
                <Text variant="body-m" tone="secondary">
                  {formatWorkoutHistoryDate(session.scheduledFor, 'detail')}
                  {session.finishedAt
                    ? ` · ${formatTime(new Date(session.finishedAt))}`
                    : ''}
                </Text>
                <Badge
                  label={workoutStatusLabel(session)}
                  tone={badgeTone[session.status]}
                  icon={
                    session.status === 'COMPLETED'
                      ? 'check'
                      : session.status === 'PARTIAL'
                      ? 'fiber_manual_record'
                      : session.status === 'SKIPPED'
                      ? 'event_busy'
                      : undefined
                  }
                />
              </View>
              <Text variant="headline">{session.dayLabel}</Text>
              <View className="flex-row flex-wrap gap-xl">
                <View className="flex-row items-center gap-xs">
                  <Icon
                    name="open_in_full"
                    size={16}
                    className="text-content-muted"
                  />
                  <Text variant="body-m" tone="secondary">
                    {formatVolumeKg(Number(session.totalVolumeKg || 0))}
                  </Text>
                </View>
                <View className="flex-row items-center gap-xs">
                  <Icon
                    name="checklist"
                    size={16}
                    className="text-content-muted"
                  />
                  <Text variant="body-m" tone="secondary">
                    {`${session.exercises.reduce(
                      (sum, exercise) => sum + exercise.sets.length,
                      0,
                    )} series`}
                  </Text>
                </View>
              </View>
            </Card>

            {session.exercises.map(exercise => (
              <Card key={exercise.exerciseId} className="gap-md">
                <Text variant="title">{exercise.exerciseName}</Text>
                {exercise.sets.length === 0 ? (
                  <Text variant="body-m" tone="secondary">
                    Sin series registradas
                  </Text>
                ) : (
                  <View className="flex-row flex-wrap gap-sm">
                    {exercise.sets.map(set => (
                      <SetSummaryTile
                        key={set.setNumber}
                        setNumber={set.setNumber}
                        loadKg={set.loadKg}
                        reps={set.reps}
                      />
                    ))}
                  </View>
                )}
              </Card>
            ))}
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
