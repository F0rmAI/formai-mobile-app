import { ScrollView, View } from 'react-native';
import { TopBar } from '@/components/layout';
import { RoutineExerciseCard, TrainingShell } from '@/components/training';
import { Badge, Text } from '@/components/ui';
import type { RoutineDay } from '@/types/training';
import { trainingScreenStyles } from './styles';

interface RoutineDayScreenProps {
  day: RoutineDay;
  isToday: boolean;
  onBack: () => void;
  onTodayPress: () => void;
}

export function RoutineDayScreen({
  day,
  isToday,
  onBack,
  onTodayPress,
}: RoutineDayScreenProps) {
  return (
    <TrainingShell
      showHeader={false}
      showBottomNav={false}
      onTodayPress={onTodayPress}
    >
      <TopBar title={day.label} onBack={onBack} />
      <ScrollView
        testID="routine-day-screen"
        className="flex-1"
        contentContainerStyle={trainingScreenStyles.scrollContent}
      >
        <View className="gap-lg py-lg">
          <View className="gap-xl">
            <Badge
              label={
                isToday ? 'Entrenamiento de hoy' : 'Programada para esta semana'
              }
              tone={isToday ? 'secondary' : 'neutral'}
              icon={isToday ? 'bolt' : 'calendar_month'}
            />
            <Text variant="body-l" tone="secondary">
              Podrás registrar las series de esta sesión el día que te toque
              realizarla.
            </Text>
          </View>
          {day.exercises.map(exercise => (
            <RoutineExerciseCard
              key={exercise.exerciseId}
              exercise={exercise}
            />
          ))}
        </View>
      </ScrollView>
    </TrainingShell>
  );
}
