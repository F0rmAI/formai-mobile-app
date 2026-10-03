/**
 * Progress dashboard: period stats, charts and recent history.
 *
 * @author Christian
 * @packageDocumentation
 */

import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ScrollView, View } from 'react-native';
import {
  AdherenceCard,
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
import { useProgressDashboard } from '@/hooks/useProgressDashboard';
import type { MainTabParamList, RootStackParamList } from '@/types/navigation';
import { formatVolumeKg } from '@/utils/progress';

/** Shows progress metrics, exercise evolution and a history preview. */
export function ProgressScreen({
  navigation,
}: {
  navigation: BottomTabNavigationProp<MainTabParamList, 'Progress'>;
}) {
  const { headerUser } = useClientProfile();
  const {
    weeks,
    weekOptions,
    weeksValue,
    setWeeks,
    previewSessions,
    exercises,
    selectedExerciseId,
    selectExercise,
    chart,
    stats,
    isLoading,
    isChartLoading,
    error,
    retry,
  } = useProgressDashboard();
  const root =
    navigation.getParent<NativeStackNavigationProp<RootStackParamList>>();

  const openHistory = () => root?.navigate('WorkoutHistory');
  const openDetail = (sessionId: string) =>
    root?.navigate('WorkoutDetail', { sessionId });

  const periodCaption =
    weeks === 4 ? 'En 4 semanas' : weeks === 8 ? 'En 8 semanas' : 'En 12 semanas';

  return (
    <TabScreenLayout
      headerSubtitle="Tu progreso"
      user={headerUser}
      title="Tu progreso"
    >
      <View className="gap-xl">
        <View className="gap-xs">
          <Text variant="body-l" tone="secondary">
            Revisa tu adherencia, volumen y la evolución de cada ejercicio.
          </Text>
        </View>

        <SegmentedControl
          label="Periodo"
          options={weekOptions}
          value={weeksValue}
          onChange={setWeeks}
          className="self-stretch"
        />

        {error && <Toast message={error} tone="error" />}

        {isLoading ? (
          <EmptyState title="Cargando progreso" icon="hourglass_top" />
        ) : (
          <>
            <View className="flex-row gap-md">
              <StatCard
                label="Sesiones"
                value={String(stats.sessionCount)}
                caption={periodCaption}
                icon="fitness_center"
              />
              <StatCard
                label="Volumen"
                value={formatVolumeKg(stats.volumeKg)}
                caption="Levantados"
                icon="monitoring"
              />
            </View>

            <AdherenceCard
              percentage={stats.adherencePercentage}
              completedCount={stats.completedCount}
              scheduledCount={stats.scheduledCount}
            />

            <Card className="gap-lg">
              <Text variant="title">Evolución</Text>
              {exercises.length === 0 ? (
                <EmptyState
                  title="Sin ejercicios registrados"
                  description="Cuando registres series verás aquí la evolución de carga y volumen."
                  icon="show_chart"
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
                      title="Datos insuficientes"
                      description="Necesitas al menos dos sesiones con este ejercicio para ver la gráfica."
                      icon="show_chart"
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

            <View className="gap-md">
              <SectionHeader
                title="Historial"
                actionLabel="Filtrar"
                onAction={openHistory}
              />
              {previewSessions.length === 0 ? (
                <EmptyState
                  title="Aún no hay entrenamientos"
                  description="Tus sesiones aparecerán aquí cuando tengas una rutina."
                  icon="event_busy"
                  action={
                    error
                      ? { label: 'Reintentar', onPress: retry }
                      : undefined
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
    </TabScreenLayout>
  );
}
