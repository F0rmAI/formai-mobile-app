/**
 * Active routine screen.
 *
 * @author Melina
 * @packageDocumentation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, View } from 'react-native';
import { ScreenContainer, TopBar } from '@/components/layout';
import { Badge, Card, EmptyState, Icon, ListItem, Text } from '@/components/ui';
import { useActiveRoutine } from '@/hooks/useActiveRoutine';
import type { RootStackParamList } from '@/types/navigation';
import { formatRoutineStartDate } from '@/utils/training-formatters';
import { nextRoutineSessionDate } from '@/utils/reminders';

/** Shows the assigned routine and ordered days using useActiveRoutine. */
export function RoutineScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Routine'>) {
  const { routine, isLoading, error, retry } = useActiveRoutine();
  const badgeForDay = (order: number) => {
    if (!routine) return undefined;
    if (order === routine.todaySessionOrder) return 'Hoy';
    const date = nextRoutineSessionDate(routine, order);
    if (!date) return undefined;
    const weekday = new Intl.DateTimeFormat('es-PE', {
      weekday: 'long',
    }).format(date);
    return weekday[0].toUpperCase() + weekday.slice(1);
  };
  return (
    <ScreenContainer>
      <TopBar title="Mi rutina" onBack={navigation.goBack} />
      <ScrollView contentContainerClassName="gap-xl p-xl">
        {isLoading ? (
          <EmptyState title="Cargando tu rutina" icon="hourglass_top" />
        ) : error ? (
          <EmptyState
            title={error}
            icon="cloud_off"
            action={{ label: 'Reintentar', onPress: retry }}
          />
        ) : !routine ? (
          <EmptyState title="Sin rutina asignada" icon="event_busy" />
        ) : (
          <>
            <Card className="gap-md">
              <View className="flex-row items-center justify-between gap-md">
                <Text variant="title-strong" className="flex-1">
                  {routine.routineName}
                </Text>
                <Badge label="Vigente" />
              </View>
              <Text variant="body-m" tone="secondary">
                desde el {formatRoutineStartDate(routine.startDate)}
              </Text>
              <View className="flex-row flex-wrap gap-lg">
                <View className="flex-row items-center gap-xs">
                  <Icon
                    name="event_repeat"
                    size={16}
                    className="text-content-muted"
                  />
                  <Text
                    variant="body-m"
                    tone="secondary"
                  >{`${routine.trainingDays.length} sesiones por semana`}</Text>
                </View>
                <View className="flex-row items-center gap-xs">
                  <Icon
                    name="history"
                    size={16}
                    className="text-content-muted"
                  />
                  <Text
                    variant="body-m"
                    tone="secondary"
                  >{`Versión ${routine.version}`}</Text>
                </View>
              </View>
            </Card>
            <Text variant="title">Sesiones</Text>
            {routine.sessions.map(day => (
              <ListItem
                key={day.order}
                icon="fitness_center"
                title={day.label}
                subtitle={`${
                  day.exercises.length
                } ejercicios · ${day.exercises.reduce(
                  (sum, exercise) => sum + exercise.sets,
                  0,
                )} series`}
                badge={badgeForDay(day.order)}
                onPress={() =>
                  navigation.navigate('RoutineDay', { order: day.order })
                }
              />
            ))}
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
