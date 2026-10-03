/**
 * Full workout history with date-range filter dialog.
 *
 * @author Christian
 * @packageDocumentation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useEffect, useRef, useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';
import {
  HistoryFilterDialog,
  WorkoutHistoryItem,
} from '@/components/progress';
import { InsetToast, ScreenContainer, TopBar } from '@/components/layout';
import { Button, EmptyState, Icon, Text, Toast } from '@/components/ui';
import { useWorkoutHistory } from '@/hooks/useWorkoutHistory';
import type { RootStackParamList } from '@/types/navigation';
import { formatDateRangeChip } from '@/utils/dates';

/** Lists paginated history and applies an inclusive date filter. */
export function WorkoutHistoryScreen({
  navigation,
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
  } = useWorkoutHistory();
  const [filterOpen, setFilterOpen] = useState(false);
  const [toast, setToast] = useState<string>();
  const pendingToast = useRef(false);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const timer = setTimeout(() => setToast(undefined), 3200);
    return () => clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!pendingToast.current || isLoading) {
      return;
    }
    pendingToast.current = false;
    if (isFiltered) {
      setToast(
        `Historial filtrado · ${totalElements} ${
          totalElements === 1 ? 'sesión' : 'sesiones'
        }`,
      );
    }
  }, [isLoading, isFiltered, totalElements]);

  const openFilter = () => {
    if (appliedFrom) {
      setFrom(appliedFrom);
    }
    if (appliedTo) {
      setTo(appliedTo);
    }
    setFilterOpen(true);
  };

  const handleApply = () => {
    if (!applyFilter()) {
      return;
    }
    setFilterOpen(false);
    pendingToast.current = Boolean(from && to);
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
        contentContainerClassName="grow gap-lg px-xl pb-8 pt-md"
        keyboardShouldPersistTaps="handled"
      >
        {isFiltered && appliedFrom && appliedTo && (
          <View className="flex-row flex-wrap items-center gap-sm">
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Quitar filtro"
              onPress={clearFilter}
              className="flex-row items-center gap-sm rounded-full bg-surface-container-low px-lg py-sm active:opacity-80"
            >
              <Text variant="label-m">
                {formatDateRangeChip(appliedFrom, appliedTo)}
              </Text>
              <Icon name="close" size={16} className="text-content-secondary" />
            </Pressable>
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
        onChangeFrom={setFrom}
        onChangeTo={setTo}
        onApply={handleApply}
        onCancel={() => setFilterOpen(false)}
      />
      {toast && <InsetToast message={toast} />}
    </ScreenContainer>
  );
}
