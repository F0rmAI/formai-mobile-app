/**
 * Routine day details.
 *
 * @author Melina
 * @packageDocumentation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native';
import { ScreenContainer, TopBar } from '@/components/layout';
import { RoutineExerciseCard } from '@/components/training';
import { EmptyState, Text } from '@/components/ui';
import { useActiveRoutine } from '@/hooks/useActiveRoutine';
import type { RootStackParamList } from '@/types/navigation';

/** Shows prescribed exercises using useActiveRoutine for the assigned day. */
export function RoutineDayScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'RoutineDay'>) {
  const { routine, isLoading, error, retry } = useActiveRoutine(
    'No pudimos cargar la sesión',
  );
  const day = routine?.sessions.find(item => item.order === route.params.order);
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
            <Text variant="body-l" tone="secondary">
              {day.order === routine?.todaySessionOrder
                ? 'Entrenamiento de hoy'
                : 'Sesión de tu rutina vigente'}
            </Text>
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
