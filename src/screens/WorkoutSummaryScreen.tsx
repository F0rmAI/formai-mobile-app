import { ScrollView, View } from 'react-native';
import { TrainingShell, WorkoutSummaryCard } from '@/components/training';
import { Badge, Button, Icon, Text } from '@/components/ui';
import type { TrainingSummary } from '@/types/training';
import { trainingScreenStyles } from './styles';

interface WorkoutSummaryScreenProps {
  summary: TrainingSummary;
  onReturnToday: () => void;
}

export function WorkoutSummaryScreen({
  summary,
  onReturnToday,
}: WorkoutSummaryScreenProps) {
  const completionPercentage =
    summary.targetSets === 0
      ? 0
      : Math.round((summary.completedSets / summary.targetSets) * 100);

  return (
    <TrainingShell showHeader={false} onTodayPress={onReturnToday}>
      <ScrollView
        testID="workout-summary-screen"
        className="flex-1"
        contentContainerStyle={trainingScreenStyles.summaryContent}
      >
        <View className="flex-1 justify-center gap-xl py-xl">
          <View className="items-center gap-md">
            <View
              className={`size-20 items-center justify-center rounded-lg ${
                summary.isPartial
                  ? 'bg-secondary-container'
                  : 'bg-tertiary-container'
              }`}
            >
              <Icon
                name={summary.isPartial ? 'flag' : 'trophy'}
                size={24}
                className={
                  summary.isPartial ? 'text-secondary-text' : 'text-tertiary'
                }
              />
            </View>
            <Text variant="headline" className="text-center">
              {summary.isPartial
                ? 'Sesión guardada como parcial'
                : '¡Sesión completada!'}
            </Text>
            <Text variant="body-l" tone="secondary" className="text-center">
              {summary.isPartial
                ? `Registraste ${summary.completedSets} de ${summary.targetSets} series. Tu entrenador verá lo que completaste.`
                : `${summary.session.dayLabel} · Entrenamiento finalizado`}
            </Text>
            <Badge
              label={
                summary.isPartial
                  ? `Parcial (${completionPercentage} %)`
                  : 'Completada'
              }
              tone={summary.isPartial ? 'secondary' : 'tertiary'}
              icon={summary.isPartial ? 'info' : 'check_circle'}
              className="self-center"
            />
          </View>

          <WorkoutSummaryCard summary={summary} />

          <Button
            label="Ver mi progreso"
            icon="monitoring"
            fullWidth
            onPress={onReturnToday}
          />
          <Button
            label="Volver a Hoy"
            variant="ghost"
            size="md"
            fullWidth
            onPress={onReturnToday}
          />
        </View>
      </ScrollView>
    </TrainingShell>
  );
}
