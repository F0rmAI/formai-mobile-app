/**
 * Routine day details.
 *
 * @author Melina
 * @packageDocumentation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, View } from 'react-native';
import { ScreenContainer, TopBar } from '@/components/layout';
import { RoutineExerciseCard } from '@/components/training';
import { EmptyState, Icon, Text } from '@/components/ui';
import { useActiveRoutine } from '@/hooks/useActiveRoutine';
import type { RootStackParamList } from '@/types/navigation';
import { nextRoutineSessionDate } from '@/utils/reminders';
import { formatLongDate } from '@/utils/dates';

/** Shows prescribed exercises using useActiveRoutine for the assigned day. */
export function RoutineDayScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'RoutineDay'>) {
  const { routine, isLoading, error, retry } = useActiveRoutine(
    'No pudimos cargar la sesión',
  );
  const day = routine?.sessions.find(item => item.order === route.params.order);
  const scheduledDate =
    routine && day && nextRoutineSessionDate(routine, day.order);
  return (
    <ScreenContainer>
      <TopBar
        title={day?.label ?? 'Día de rutina'}
        onBack={navigation.goBack}
      />
      <ScrollView contentContainerClassName="gap-lg p-xl">
        {isLoading ? (
          <EmptyState title="Cargando sesión" icon="hourglass_top" />
        ) : error ? (
          <EmptyState
            title={error}
            action={{ label: 'Reintentar', onPress: retry }}
          />
        ) : !day ? (
          <EmptyState title="Sesión no disponible" />
        ) : (
          <>
            {scheduledDate && (
              <View className="flex-row items-center gap-xs">
                <Icon name="event" size={16} className="text-content-muted" />
                <Text variant="body-l" tone="secondary">
                  {`Programada para el ${formatLongDate(
                    scheduledDate,
                  ).toLowerCase()}`}
                </Text>
              </View>
            )}
            {day.order !== routine?.todaySessionOrder && (
              <Text variant="body-l" tone="secondary">
                Podrás registrar las series de esta sesión el día que te toque
                realizarla.
              </Text>
            )}
            {day.exercises.map(exercise => (
              <RoutineExerciseCard
                key={exercise.exerciseId}
                exercise={exercise}
              />
            ))}
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
