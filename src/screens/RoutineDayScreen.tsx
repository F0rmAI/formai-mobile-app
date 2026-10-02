/**
 * Routine day details.
 *
 * @author Melina
 * @packageDocumentation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/layout';
import { RoutineExerciseCard } from '@/components/training';
import { EmptyState, Text } from '@/components/ui';
import { useActiveRoutine } from '@/hooks/useActiveRoutine';
import type { RootStackParamList } from '@/types/navigation';

/** Shows the exercises prescribed for a routine day. */
export function RoutineDayScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'RoutineDay'>) {
  const insets = useSafeAreaInsets();
  const { routine, loading, error, retry } = useActiveRoutine();
  const day = routine?.sessions.find(item => item.order === route.params.order);
  return (
    <View
      className="flex-1 bg-surface-background"
      style={{ paddingTop: insets.top }}
    >
      <TopBar
        title={day?.label ?? 'Día de rutina'}
        onBack={navigation.goBack}
      />
      <ScrollView contentContainerClassName="gap-lg p-xl">
        {loading ? (
          <EmptyState title="Cargando sesión" icon="hourglass_top" />
        ) : error ? (
          <EmptyState
            title="No pudimos cargar la sesión"
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
    </View>
  );
}
