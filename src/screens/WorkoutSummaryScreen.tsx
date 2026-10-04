/**
 * Finished workout summary.
 *
 * @author Melina
 * @packageDocumentation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, View } from 'react-native';
import { BottomNav, ScreenContainer } from '@/components/layout';
import { WorkoutSummaryCard } from '@/components/training';
import { Badge, Button, EmptyState, Icon, Text } from '@/components/ui';
import { useWorkoutSession } from '@/hooks/useWorkoutSession';
import type { RootStackParamList } from '@/types/navigation';
import { formatTrainingDate } from '@/utils/training-formatters';

/** Shows a completed or partial session using useWorkoutSession for backend totals. */
export function WorkoutSummaryScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'WorkoutSummary'>) {
  const { session, isLoading, error, retry } = useWorkoutSession(
    route.params.sessionId,
    'No pudimos cargar el resumen',
  );
  const completedSets =
    session?.exercises.reduce(
      (sum, exercise) => sum + exercise.sets.length,
      0,
    ) ?? 0;
  const targetSets =
    session?.exercises.reduce(
      (sum, exercise) => sum + exercise.targetSets,
      0,
    ) ?? 0;
  return (
    <ScreenContainer>
      <ScrollView
        className="flex-1"
        contentContainerClassName="grow justify-center gap-xl p-xl"
      >
        {isLoading ? (
          <EmptyState title="Cargando resumen" icon="hourglass_top" />
        ) : error ? (
          <EmptyState
            title={error}
            action={{ label: 'Reintentar', onPress: retry }}
          />
        ) : session ? (
          <>
            <View className="items-center gap-md">
              <Icon
                name={session.status === 'PARTIAL' ? 'flag' : 'emoji_events'}
                size={24}
              />
              <Text variant="headline" className="text-center">
                {session.status === 'PARTIAL'
                  ? 'Sesión guardada como parcial'
                  : session.status === 'COMPLETED'
                  ? '¡Sesión completada!'
                  : 'Resumen de sesión'}
              </Text>
              {session.status === 'PARTIAL' ? (
                <Text variant="body-l" tone="secondary" className="text-center">
                  {`Registraste ${completedSets} de ${targetSets} series. Tu entrenador verá lo que completaste.`}
                </Text>
              ) : (
                <Text variant="body-l" tone="secondary">
                  {`${session.dayLabel} · ${formatTrainingDate(
                    session.scheduledFor,
                  )}`}
                </Text>
              )}
              <Badge
                label={
                  session.status === 'PARTIAL'
                    ? `Parcial (${
                        targetSets
                          ? Math.round((completedSets / targetSets) * 100)
                          : 0
                      } %)`
                    : session.status === 'COMPLETED'
                    ? 'Completada'
                    : session.status === 'SKIPPED'
                    ? 'Omitida'
                    : 'Pendiente'
                }
                icon={session.status === 'COMPLETED' ? 'check' : undefined}
              />
            </View>
            <WorkoutSummaryCard
              summary={{
                session,
                completedSets,
                targetSets,
                isPartial: completedSets < targetSets,
              }}
            />
            <Button
              label="Ver mi progreso"
              icon="monitoring"
              onPress={() =>
                navigation.navigate('Main', { screen: 'Progress' })
              }
              fullWidth
            />
            <Button
              label="Volver a Hoy"
              variant="ghost"
              onPress={() => navigation.navigate('Main', { screen: 'Today' })}
              fullWidth
            />
          </>
        ) : (
          <EmptyState title="Sesión no disponible" />
        )}
      </ScrollView>
      <BottomNav
        items={[
          { key: 'Today', label: 'Hoy', icon: 'fitness_center' },
          { key: 'Progress', label: 'Progreso', icon: 'monitoring' },
          { key: 'Profile', label: 'Perfil', icon: 'person' },
        ]}
        activeKey="Today"
        onChange={key => navigation.navigate('Main', { screen: key })}
      />
    </ScreenContainer>
  );
}
