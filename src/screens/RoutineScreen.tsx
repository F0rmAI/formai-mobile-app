/**
 * Active routine screen.
 *
 * @author Melina
 * @packageDocumentation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView } from 'react-native';
import { ScreenContainer, TopBar } from '@/components/layout';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ListItem,
  Text,
} from '@/components/ui';
import { useActiveRoutine } from '@/hooks/useActiveRoutine';
import type { RootStackParamList } from '@/types/navigation';
import { formatRoutineStartDate } from '@/utils/training-formatters';

/** Shows the assigned routine and ordered days using useActiveRoutine. */
export function RoutineScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Routine'>) {
  const { routine, isLoading, error, retry } = useActiveRoutine();
  return (
    <ScreenContainer>
      <TopBar title="Mi rutina" onBack={navigation.goBack} />
      <ScrollView contentContainerClassName="gap-lg p-xl">
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
              <Text variant="title-strong">{routine.routineName}</Text>
              <Text variant="body-m" tone="secondary">
                Vigente desde el {formatRoutineStartDate(routine.startDate)} ·
                Versión {routine.version}
              </Text>
              <Badge label="Vigente" />
            </Card>
            <Text variant="title">Sesiones</Text>
            {routine.sessions.map(day => (
              <ListItem
                key={day.order}
                title={day.label}
                subtitle={`${
                  day.exercises.length
                } ejercicios · ${day.exercises.reduce(
                  (sum, exercise) => sum + exercise.sets,
                  0,
                )} series`}
                badge={
                  day.order === routine.todaySessionOrder ? 'Hoy' : undefined
                }
                onPress={() =>
                  navigation.navigate('RoutineDay', { order: day.order })
                }
              />
            ))}
            <Button
              label="Volver"
              variant="ghost"
              onPress={navigation.goBack}
            />
          </>
        )}
      </ScrollView>
    </ScreenContainer>
  );
}
