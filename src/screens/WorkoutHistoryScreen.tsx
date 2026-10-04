/**
 * Full workout history with date-range filter dialog.
 *
 * @author Christian
 * @packageDocumentation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { HistoryDateRangeChip } from '@/components/history';
import { HistoryFilterDialog, WorkoutHistoryItem } from '@/components/progress';
import { ScreenContainer, TopBar } from '@/components/layout';
import { Button, EmptyState, Text, Toast } from '@/components/ui';
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory';
import type { RootStackParamList } from '@/types/navigation';
import { formatDateRangeChip, formatFilterInputDate } from '@/utils/dates';

/** Lists paginated history and applies an inclusive date filter. */
export function WorkoutHistoryScreen({
  navigation,
  route,
}: NativeStackScreenProps<RootStackParamList, 'WorkoutHistory'>) {
  const {
    from,
    to,
    setFrom,
    setTo,
    appliedFrom,
    appliedTo,
    sessions,
    totalElements,
    isFiltered,
    isLoading,
    error,
    applyFilter,
    clearFilter,
    retry,
    loadMore,
    hasMore,
  } = useWorkoutHistory(route.params);
  const [filterOpen, setFilterOpen] = useState(false);

  const openFilter = () => {
    if (appliedFrom) {
      setFrom(formatFilterInputDate(appliedFrom));
    }
    if (appliedTo) {
      setTo(formatFilterInputDate(appliedTo));
    }
    setFilterOpen(true);
  };

  const handleApply = () => {
    if (!applyFilter()) {
      return;
    }
    setFilterOpen(false);
  };

  return (
    <ScreenContainer>
      <TopBar
        title="Historial"
        onBack={navigation.goBack}
        action={{
          icon: 'filter_list',
          label: 'Filtrar',
          onPress: openFilter,
        }}
      />
      <ScrollView
        contentContainerClassName="grow gap-xl px-xl pb-8 pt-md"
        keyboardShouldPersistTaps="handled"
      >
        {isFiltered && appliedFrom && appliedTo && (
          <View className="flex-row flex-wrap items-center gap-sm">
            <HistoryDateRangeChip
              label={formatDateRangeChip(appliedFrom, appliedTo)}
              onPress={clearFilter}
            />
            <Text variant="body-m" tone="secondary">
              {`${totalElements} ${
                totalElements === 1 ? 'entrenamiento' : 'entrenamientos'
              } en este rango`}
            </Text>
          </View>
        )}

        {error && <Toast message={error} tone="error" />}

        {isLoading && sessions.length === 0 ? (
          <EmptyState title="Cargando historial" icon="hourglass_top" />
        ) : sessions.length === 0 ? (
          <EmptyState
            title={
              isFiltered
                ? 'Sin entrenamientos en este rango'
                : 'Aún no hay entrenamientos'
            }
            description={
              isFiltered
                ? undefined
                : 'Tus sesiones aparecerán aquí cuando tengas una rutina.'
            }
            icon="event_busy"
            action={
              isFiltered
                ? { label: 'Cambiar filtro', onPress: openFilter }
                : error
                ? { label: 'Reintentar', onPress: retry }
                : { label: 'Filtrar', onPress: openFilter }
            }
          />
        ) : (
          <View className="gap-sm">
            {sessions.map(session => (
              <WorkoutHistoryItem
                key={session.id}
                session={session}
                onPress={() =>
                  navigation.navigate('WorkoutDetail', {
                    sessionId: session.id,
                  })
                }
              />
            ))}
          </View>
        )}

        {hasMore && (
          <Button
            label="Cargar más"
            loading={isLoading}
            onPress={loadMore}
            fullWidth
          />
        )}
      </ScrollView>

      <HistoryFilterDialog
        open={filterOpen}
        from={from}
        to={to}
        error={error}
        onChangeFrom={setFrom}
        onChangeTo={setTo}
        onApply={handleApply}
        onCancel={() => setFilterOpen(false)}
      />
    </ScreenContainer>
  );
}
