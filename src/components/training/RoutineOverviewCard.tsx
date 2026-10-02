import { View } from 'react-native';
import { Button, Card, ProgressBar, SectionLabel, Text } from '@/components/ui';
import type { ActiveRoutine, WorkoutSession } from '@/types/training';

interface RoutineOverviewCardProps {
  routine: ActiveRoutine;
  session: WorkoutSession;
  completedSets: number;
  targetSets: number;
  onViewRoutine: () => void;
}

export function RoutineOverviewCard({
  routine,
  session,
  completedSets,
  targetSets,
  onViewRoutine,
}: RoutineOverviewCardProps) {
  const progress = targetSets === 0 ? 0 : (completedSets / targetSets) * 100;

  return (
    <Card className="gap-xl p-xl">
      <SectionLabel label="Sesión de hoy" tone="secondary" icon="bolt" />
      <View className="gap-xs">
        <Text variant="title-strong">{session.dayLabel}</Text>
        <Text variant="body-m" tone="secondary" numberOfLines={1}>
          {session.exercises.length} ejercicios · {targetSets} series ·{' '}
          {routine.routineName}
        </Text>
      </View>
      <View className="gap-sm">
        <View className="flex-row justify-between">
          <Text variant="label-m" tone="secondary">
            Progreso
          </Text>
          <Text variant="label-m-bold">
            {completedSets}/{targetSets} series
          </Text>
        </View>
        <ProgressBar value={progress} label="Progreso de la sesión" />
      </View>
      <Button
        testID="view-routine-button"
        label="Ver mi rutina"
        icon="calendar_month"
        variant="ghost"
        size="md"
        className="h-9"
        onPress={onViewRoutine}
      />
    </Card>
  );
}
