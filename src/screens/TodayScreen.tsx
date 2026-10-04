/**
 * Today's training screen.
 *
 * @author Melina
 * @packageDocumentation
 */

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { View } from 'react-native';
import { InsetToast, TabScreenLayout } from '@/components/layout';
import {
  RoutineOverviewCard,
  WorkoutExerciseCard,
} from '@/components/training';
import { Button, Dialog, EmptyState, Text, Toast } from '@/components/ui';
import { useClientProfile } from '@/hooks/useClientProfile';
import { useTraining } from '@/hooks/useTraining';
import type { MainTabParamList, RootStackParamList } from '@/types/navigation';
import type { RecordSetInput } from '@/types/training';
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
    refreshing,
    saving,
    error,
    refreshError,
    retry,
    refresh,
    recordSet,
    correctSet,
    finishSession,
  } = useTraining();
  const [confirmPartial, setConfirmPartial] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string>();
  useEffect(() => {
    if (!successMessage) return;
    const timer = setTimeout(() => setSuccessMessage(undefined), 3200);
    return () => clearTimeout(timer);
  }, [successMessage]);
  const root =
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();
  const openRoutine = () => root?.navigate('Routine');
  const finish = async (partial: boolean) => {
    const result = await finishSession(partial);
    setConfirmPartial(false);
    if (result) root?.navigate('WorkoutSummary', { sessionId: result.id });
  };
  const record = async (input: RecordSetInput) => {
    const saved = await recordSet(input);
    if (saved) {
      setSuccessMessage(
        `Serie ${input.setNumber} registrada · ${input.loadKg} kg × ${input.reps} reps`,
      );
    }
    return saved;
  };
  const currentExerciseId = session?.exercises.find(
    exercise => exercise.sets.length < exercise.targetSets,
  )?.exerciseId;
  const pendingExercises =
    session?.exercises.filter(
      exercise => exercise.sets.length < exercise.targetSets,
    ).length ?? 0;
  const routineDay = routine?.sessions.find(
    day => day.order === routine.todaySessionOrder,
  );
  const sessionDate = session && formatTrainingDate(session.scheduledFor);
  return (
    <>
      <TabScreenLayout
        headerSubtitle="Entrenamiento de hoy"
        user={headerUser}
        title={firstName ? `Hola, ${firstName}` : 'Hola'}
        subtitle={
          sessionDate
            ? sessionDate[0].toUpperCase() + sessionDate.slice(1)
            : undefined
        }
        refreshing={refreshing}
        onRefresh={refresh}
      >
        {refreshError && <Toast message={refreshError} tone="error" />}
        {isLoading ? (
          <EmptyState icon="hourglass_top" title="Cargando tu entrenamiento" />
        ) : error &&
          (!routine || (routine.todayWorkoutSessionId && !session)) ? (
          <EmptyState
            icon="cloud_off"
            title="No pudimos cargar tu entrenamiento"
            description={error}
            action={{ label: 'Reintentar', icon: 'refresh', onPress: retry }}
          />
        ) : !routine ? (
          <EmptyState
            icon="event_busy"
            title="Aún no tienes una rutina"
            description="Tu entrenador todavía no te asignó una rutina. Cuando lo haga, verás aquí tu sesión."
            action={{ label: 'Actualizar', icon: 'refresh', onPress: retry }}
          />
        ) : !session || !summary ? (
          <View className="gap-xl">
            <EmptyState
              icon="event"
              title="Hoy es día de descanso"
              description="No tienes una sesión programada para hoy."
            />
            <Text variant="body-m" tone="secondary">
              Tus días de entrenamiento:{' '}
              {routine.trainingDays.map(day => dayNames[day]).join(', ')}.
            </Text>
            <Button label="Ver mi rutina" fullWidth onPress={openRoutine} />
          </View>
        ) : (
          <View className="gap-xl">
            {error && <Toast message={error} tone="error" />}
            <RoutineOverviewCard
              routine={routine}
              session={session}
              completedSets={summary.completedSets}
              targetSets={summary.targetSets}
              onViewRoutine={openRoutine}
            />
            {session.exercises.map(exercise => (
              <WorkoutExerciseCard
                key={exercise.exerciseId}
                exercise={exercise}
                current={exercise.exerciseId === currentExerciseId}
                restSeconds={
                  routineDay?.exercises.find(
                    prescribed => prescribed.exerciseId === exercise.exerciseId,
                  )?.restSeconds
                }
                saving={saving}
                readOnly={session.status !== 'PENDING'}
                onRecordSet={record}
                onCorrectSet={correctSet}
              />
            ))}
            <Button
              label={
                session.status === 'PENDING'
                  ? 'Finalizar sesión'
                  : 'Ver resumen'
              }
              icon="flag"
              fullWidth
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
              description={`Tienes ${
                summary.targetSets - summary.completedSets
              } series sin registrar en ${pendingExercises} ejercicios. La sesión se guardará como parcial.`}
              confirmLabel="Finalizar"
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
      {successMessage && <InsetToast message={successMessage} aboveTabs />}
    </>
  );
}
