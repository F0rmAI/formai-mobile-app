import { ScrollView, View } from 'react-native';
import { TopBar } from '@/components/layout';
import { TrainingShell } from '@/components/training';
import {
  Badge,
  Card,
  Icon,
  ListItem,
  SectionHeader,
  Text,
} from '@/components/ui';
import type { ActiveRoutine } from '@/types/training';
import { formatRoutineStartDate } from '@/utils/training-formatters';
import { trainingScreenStyles } from './styles';

interface RoutineScreenProps {
  routine: ActiveRoutine;
  onBack: () => void;
  onOpenDay: (order: number) => void;
  onTodayPress: () => void;
}

export function RoutineScreen({
  routine,
  onBack,
  onOpenDay,
  onTodayPress,
}: RoutineScreenProps) {
  const dayBadges = ['Hoy', 'Sábado', 'Lunes', 'Miércoles'];
  const dayIcons = [
    'fitness_center',
    'directions_run',
    'sports_gymnastics',
    'self_improvement',
  ];

  return (
    <TrainingShell
      showHeader={false}
      showBottomNav={false}
      onTodayPress={onTodayPress}
    >
      <TopBar title="Mi rutina" onBack={onBack} />
      <ScrollView
        testID="routine-screen"
        className="flex-1"
        contentContainerStyle={trainingScreenStyles.scrollContent}
      >
        <View className="gap-lg py-lg">
          <Card className="gap-xl p-xl">
            <View className="flex-row items-start justify-between gap-md">
              <View className="min-w-0 flex-1 gap-xs">
                <Text variant="title-strong">{routine.routineName}</Text>
                <Text variant="body-m" tone="secondary">
                  Asignada por {routine.trainerName ?? 'tu entrenadora'} · desde
                  el {formatRoutineStartDate(routine.startDate)}
                </Text>
              </View>
              <Badge label="Vigente" tone="tertiary" icon="check_circle" />
            </View>
            <View className="flex-row gap-xl">
              <View className="flex-row items-center gap-xs">
                <Icon name="event" size={16} className="text-primary" />
                <Text variant="body-m" tone="secondary">
                  {routine.sessions.length} sesiones por semana
                </Text>
              </View>
              <View className="flex-row items-center gap-xs">
                <Icon name="history" size={16} className="text-primary" />
                <Text variant="body-m" tone="secondary">
                  Versión {routine.version}
                </Text>
              </View>
            </View>
          </Card>

          <SectionHeader title="Sesiones" />

          <View className="gap-sm">
            {routine.sessions.map((day, index) => (
              <ListItem
                key={day.order}
                title={day.label}
                subtitle={`${
                  day.exercises.length
                } ejercicios · ${day.exercises.reduce(
                  (total, exercise) => total + exercise.sets,
                  0,
                )} series`}
                icon={dayIcons[index % dayIcons.length]}
                badge={
                  day.order === routine.todaySessionOrder
                    ? 'Hoy'
                    : dayBadges[index % dayBadges.length]
                }
                badgeTone={
                  day.order === routine.todaySessionOrder
                    ? 'primary'
                    : 'neutral'
                }
                onPress={() => onOpenDay(day.order)}
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </TrainingShell>
  );
}
