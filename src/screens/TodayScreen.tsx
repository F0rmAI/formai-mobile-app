/**
 * Today's training screen.
 *
 * @author Melina
 * @packageDocumentation
 */

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { View } from 'react-native';
import { TabScreenLayout } from '@/components/layout';
import {
  RoutineOverviewCard,
  WorkoutExerciseCard,
} from '@/components/training';
import { Button, Dialog, EmptyState, Text, Toast } from '@/components/ui';
import { useClientProfile } from '@/hooks/useClientProfile';
import { useTraining } from '@/hooks/useTraining';
import type { MainTabParamList, RootStackParamList } from '@/types/navigation';
import { formatTrainingDate } from '@/utils/training-formatters';

const dayNames: Record<string, string> = {
  MONDAY: 'lunes',
  TUESDAY: 'martes',
  WEDNESDAY: 'miércoles',
  THURSDAY: 'jueves',
  FRIDAY: 'viernes',
  SATURDAY: 'sábado',
  SUNDAY: 'domingo',
};

/** Shows today's workout and rest states using useTraining for data and actions. */
export function TodayScreen({
  navigation,
}: {
  navigation: BottomTabNavigationProp<MainTabParamList, 'Today'>;
}) {
  const { firstName, headerUser } = useClientProfile();
  const {
    routine,
    session,
    summary,
    isLoading,
    saving,
    error,
    retry,
    recordSet,
    correctSet,
    finishSession,
  } = useTraining();
  const [confirmPartial, setConfirmPartial] = useState(false);
  const root =
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
  const openRoutine = () => root?.navigate('Routine');
  const finish = async (partial: boolean) => {
    const result = await finishSession(partial);
    setConfirmPartial(false);
    if (result) root?.navigate('WorkoutSummary', { sessionId: result.id });
  };
  return (
    <TabScreenLayout
      headerSubtitle="Entrenamiento de hoy"
      user={headerUser}
      title={firstName ? `Hola, ${firstName}` : 'Hola'}
    >
      {isLoading ? (
        <EmptyState icon="hourglass_top" title="Cargando tu entrenamiento" />
      ) : error && (!routine || (routine.todayWorkoutSessionId && !session)) ? (
        <EmptyState
          icon="cloud_off"
          title="No pudimos cargar tu entrenamiento"
          description={error}
          action={{ label: 'Reintentar', icon: 'refresh', onPress: retry }}
        />
      ) : !routine ? (
        <EmptyState
          icon="event_busy"
          title="Aún no tienes una rutina activa"
          description="Cuando tu entrenador te asigne una rutina, aparecerá aquí."
          action={{ label: 'Actualizar', icon: 'refresh', onPress: retry }}
        />
      ) : !session || !summary ? (
        <View className="gap-lg">
          <EmptyState
            icon="event"
            title="Hoy es día de descanso"
            description="No tienes una sesión programada para hoy."
          />
          <Text variant="body-m" tone="secondary">
            Tus días de entrenamiento:{' '}
            {routine.trainingDays.map(day => dayNames[day]).join(', ')}.
          </Text>
          <Button label="Ver mi rutina" onPress={openRoutine} />
        </View>
      ) : (
        <View className="gap-lg">
          <Text variant="body-l" tone="secondary">
            {formatTrainingDate(session.scheduledFor)}
          </Text>
          {error && <Toast message={error} tone="error" />}
          <RoutineOverviewCard
            routine={routine}
            session={session}
            completedSets={summary.completedSets}
            targetSets={summary.targetSets}
            onViewRoutine={openRoutine}
          />
          {session.status === 'PENDING' && !summary.isPartial && (
            <Text variant="body-l">
              Todas las series están registradas. Ya puedes finalizar tu
              entrenamiento.
            </Text>
          )}
          {session.exercises.map(exercise => (
            <WorkoutExerciseCard
              key={exercise.exerciseId}
              exercise={exercise}
              saving={saving}
              readOnly={session.status !== 'PENDING'}
              onRecordSet={recordSet}
              onCorrectSet={correctSet}
            />
          ))}
          <Button
            label={
              session.status === 'PENDING'
                ? 'Finalizar entrenamiento'
                : 'Ver resumen'
            }
            loading={saving}
            onPress={() =>
              session.status !== 'PENDING'
                ? root?.navigate('WorkoutSummary', { sessionId: session.id })
                : summary.isPartial
                ? setConfirmPartial(true)
                : finish(false)
            }
          />
          <Dialog
            open={confirmPartial}
            title="¿Finalizar la sesión?"
            description={`Faltan ${
              summary.targetSets - summary.completedSets
            } series. La sesión quedará como parcial.`}
            confirmLabel="Finalizar parcial"
            cancelLabel="Seguir entrenando"
            confirmLoading={saving}
            onConfirm={() => {
              finish(true);
            }}
            onCancel={() => setConfirmPartial(false)}
          />
        </View>
      )}
    </TabScreenLayout>
  );
}
