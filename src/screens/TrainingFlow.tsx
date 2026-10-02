import { useState } from 'react';
import { View } from 'react-native';
import { TrainingShell } from '@/components/training';
import { EmptyState, Toast } from '@/components/ui';
import { useTraining } from '@/hooks/useTraining';
import { RoutineDayScreen } from './RoutineDayScreen';
import { RoutineScreen } from './RoutineScreen';
import { TodayScreen } from './TodayScreen';
import { WorkoutSummaryScreen } from './WorkoutSummaryScreen';

type Route =
  | { name: 'today' }
  | { name: 'routine' }
  | { name: 'day'; order: number }
  | { name: 'summary' };

export function TrainingFlow() {
  const [route, setRoute] = useState<Route>({ name: 'today' });
  const {
    routine,
    session,
    summary,
    loading,
    saving,
    error,
    retry,
    recordSet,
    finishSession,
  } = useTraining();

  if (loading) {
    return (
      <TrainingShell subtitle="Entrenamiento de hoy" onTodayPress={() => {}}>
        <View className="flex-1 justify-center px-xl">
          <EmptyState
            title="Cargando tu entrenamiento"
            description="Estamos preparando la rutina de hoy."
            icon="hourglass_top"
          />
        </View>
      </TrainingShell>
    );
  }

  if (error && (!routine || !session || !summary)) {
    return (
      <TrainingShell subtitle="Entrenamiento de hoy" onTodayPress={() => {}}>
        <View className="flex-1 justify-center gap-xl px-xl">
          <Toast message={error} tone="error" />
          <EmptyState
            title="No pudimos cargar tu entrenamiento"
            description="Revisa tu conexión e inténtalo nuevamente."
            icon="cloud_off"
            action={{ label: 'Reintentar', icon: 'refresh', onPress: retry }}
          />
        </View>
      </TrainingShell>
    );
  }

  if (!routine || !session || !summary) {
    return (
      <TrainingShell subtitle="Entrenamiento de hoy" onTodayPress={() => {}}>
        <View className="flex-1 justify-center px-xl">
          <EmptyState
            title="Aún no tienes una rutina activa"
            description="Cuando tu entrenador te asigne una rutina, aparecerá aquí."
            icon="event_busy"
            action={{ label: 'Actualizar', icon: 'refresh', onPress: retry }}
          />
        </View>
      </TrainingShell>
    );
  }

  const goToday = () => setRoute({ name: 'today' });

  if (route.name === 'routine') {
    return (
      <RoutineScreen
        routine={routine}
        onBack={goToday}
        onTodayPress={goToday}
        onOpenDay={order => setRoute({ name: 'day', order })}
      />
    );
  }

  if (route.name === 'day') {
    const day = routine.sessions.find(item => item.order === route.order);
    if (day) {
      return (
        <RoutineDayScreen
          day={day}
          isToday={day.order === routine.todaySessionOrder}
          onBack={() => setRoute({ name: 'routine' })}
          onTodayPress={goToday}
        />
      );
    }
  }

  if (route.name === 'summary') {
    return <WorkoutSummaryScreen summary={summary} onReturnToday={goToday} />;
  }

  return (
    <TodayScreen
      routine={routine}
      session={session}
      summary={summary}
      saving={saving}
      error={error}
      onRecordSet={recordSet}
      onFinish={async confirmPartial =>
        Boolean(await finishSession(confirmPartial))
      }
      onViewRoutine={() => setRoute({ name: 'routine' })}
      onShowSummary={() => setRoute({ name: 'summary' })}
    />
  );
}
