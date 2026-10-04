/**
 * Progress dashboard: period stats, charts and recent history.
 *
 * @author Christian
 * @packageDocumentation
 */

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import {
  AdherenceCard,
  HistoryFilterDialog,
  ProgressLineChart,
  StatCard,
  WorkoutHistoryItem,
} from '@/components/progress';
import { TabScreenLayout } from '@/components/layout';
import {
  Card,
  Chip,
  EmptyState,
  SectionHeader,
  SegmentedControl,
  Text,
  Toast,
} from '@/components/ui';
import { useClientProfile } from '@/hooks/useClientProfile';
import { useActiveRoutine } from '@/hooks/useActiveRoutine';
import { useProgressDashboard } from '@/hooks/useProgressDashboard';
import type { MainTabParamList, RootStackParamList } from '@/types/navigation';
import { formatVolumeKg } from '@/utils/progress';
import { parseFilterDate } from '@/utils/dates';

/** Shows progress metrics, exercise evolution and a history preview. */
export function ProgressScreen({
  navigation,
}: {
  navigation: BottomTabNavigationProp<MainTabParamList, 'Progress'>;
}) {
  const { headerUser } = useClientProfile();
  const {
    routine,
    refreshing: routineRefreshing,
    error: routineError,
    refresh: refreshRoutine,
  } = useActiveRoutine();
  const [filterOpen, setFilterOpen] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [filterError, setFilterError] = useState<string>();
  const {
    weeks,
    weekOptions,
    weeksValue,
    setWeeks,
    previewSessions,
    exercises,
    selectedExerciseId,
    selectedExercise,
    selectExercise,
    chart,
    stats,
    maxLoadKg,
    maxLoadDeltaKg,
    weeklyVolumeKg,
    weeklyVolumeDeltaPercent,
    isLoading,
    refreshing: dashboardRefreshing,
    isChartLoading,
    error,
    retry,
    refresh: refreshDashboard,
  } = useProgressDashboard();
  const root =
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

  const applyFilter = () => {
    const parsedFrom = parseFilterDate(from);
    const parsedTo = parseFilterDate(to);
    if (!parsedFrom || !parsedTo || parsedFrom > parsedTo) {
      setFilterError(
        'Ingresa dos fechas válidas en formato dd/mm/aaaa. La fecha inicial debe ser anterior a la final.',
      );
      return;
    }
    setFilterError(undefined);
    setFilterOpen(false);
    root?.navigate('WorkoutHistory', { from: parsedFrom, to: parsedTo });
  };
  const openDetail = (sessionId: string) =>
    root?.navigate('WorkoutDetail', { sessionId });

  return (
    <TabScreenLayout
      headerSubtitle="Tu progreso"
      user={headerUser}
      title="Tu progreso"
      subtitle={routine ? `Rutina ${routine.routineName}` : undefined}
      refreshing={routineRefreshing || dashboardRefreshing}
      onRefresh={() => {
        Promise.all([refreshDashboard(), refreshRoutine()]);
      }}
    >
      <View className="gap-xl">
        <SegmentedControl
          label="Periodo"
          options={weekOptions}
          value={weeksValue}
          onChange={setWeeks}
          className="self-stretch"
        />

        {error && <Toast message={error} tone="error" />}
        {routineError && <Toast message={routineError} tone="error" />}

        {isLoading ? (
          <EmptyState title="Cargando progreso" icon="hourglass_top" />
        ) : (
          <>
            <View className="flex-row gap-md">
              <StatCard
                label="Carga máxima"
                value={maxLoadKg === undefined ? '—' : `${maxLoadKg} kg`}
                caption={selectedExercise?.exerciseName ?? 'Sin registros'}
                icon="military_tech"
                delta={
                  maxLoadDeltaKg === undefined
                    ? undefined
                    : `${maxLoadDeltaKg >= 0 ? '+' : ''}${maxLoadDeltaKg} kg`
                }
              />
              <StatCard
                label="Volumen semanal"
                value={formatVolumeKg(weeklyVolumeKg ?? 0)}
                caption="Esta semana"
                icon="local_fire_department"
                delta={
                  weeklyVolumeDeltaPercent === undefined
                    ? undefined
                    : `${
                        weeklyVolumeDeltaPercent >= 0 ? '+' : ''
                      }${weeklyVolumeDeltaPercent} %`
                }
              />
            </View>

            <AdherenceCard
              percentage={stats.adherencePercentage}
              completedCount={stats.completedCount}
              scheduledCount={stats.scheduledCount}
              partialCount={stats.partialCount}
              skippedCount={stats.skippedCount}
              weeks={weeks}
            />

            <Card className="gap-lg">
              <Text variant="title">Evolución por ejercicio</Text>
              {exercises.length === 0 ? (
                <EmptyState
                  title="Aún no hay datos suficientes"
                  description="Registra este ejercicio en al menos dos sesiones para ver su evolución."
                  icon="query_stats"
                />
              ) : (
                <>
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerClassName="gap-sm"
                  >
                    {exercises.map(exercise => (
                      <Chip
                        key={exercise.exerciseId}
                        label={exercise.exerciseName}
                        selected={exercise.exerciseId === selectedExerciseId}
                        onPress={() => selectExercise(exercise.exerciseId)}
                      />
                    ))}
                  </ScrollView>
                  {isChartLoading ? (
                    <EmptyState
                      title="Cargando evolución"
                      icon="hourglass_top"
                    />
                  ) : chart && !chart.enoughData ? (
                    <EmptyState
                      title="Aún no hay datos suficientes"
                      description="Registra este ejercicio en al menos dos sesiones para ver su evolución."
                      icon="query_stats"
                    />
                  ) : chart ? (
                    <ProgressLineChart points={chart.points} />
                  ) : (
                    <EmptyState
                      title="No pudimos cargar la evolución"
                      action={{ label: 'Reintentar', onPress: retry }}
                    />
                  )}
                </>
              )}
            </Card>

            <View className="gap-xl">
              <SectionHeader
                title="Historial"
                actionLabel="Filtrar por fechas"
                onAction={() => setFilterOpen(true)}
              />
              {previewSessions.length === 0 ? (
                <EmptyState
                  title="Aún no hay entrenamientos"
                  description="Tus sesiones aparecerán aquí cuando tengas una rutina."
                  icon="event_busy"
                  action={
                    error ? { label: 'Reintentar', onPress: retry } : undefined
                  }
                />
              ) : (
                <View className="gap-sm">
                  {previewSessions.map(session => (
                    <WorkoutHistoryItem
                      key={session.id}
                      session={session}
                      onPress={() => openDetail(session.id)}
                    />
                  ))}
                </View>
              )}
            </View>
          </>
        )}
      </View>
      <HistoryFilterDialog
        open={filterOpen}
        from={from}
        to={to}
        error={filterError}
        onChangeFrom={value => {
          setFrom(value);
          setFilterError(undefined);
        }}
        onChangeTo={value => {
          setTo(value);
          setFilterError(undefined);
        }}
        onApply={applyFilter}
        onCancel={() => {
          setFilterOpen(false);
          setFilterError(undefined);
        }}
      />
    </TabScreenLayout>
  );
}
