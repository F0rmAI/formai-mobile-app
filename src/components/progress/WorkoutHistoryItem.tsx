/**
 * History row for the progress and historial screens.
 *
 * @author Christian
 * @packageDocumentation
 */

import { Pressable, View } from 'react-native';
import { Badge, Card, Icon, Text } from '@/components/ui';
import type { WorkoutSession, WorkoutStatus } from '@/types/training';
import { cn } from '@/utils/cn';
import { formatWorkoutHistoryDate } from '@/utils/dates';
import {
  formatVolumeKg,
  recordedExerciseCount,
  sessionDurationMinutes,
  statusLabel,
} from '@/utils/progress';

const badgeTone: Record<
  WorkoutStatus,
  'tertiary' | 'secondary' | 'neutral' | 'primary'
> = {
  COMPLETED: 'tertiary',
  PARTIAL: 'secondary',
  SKIPPED: 'neutral',
  PENDING: 'primary',
};

/**
 * Props accepted by {@link WorkoutHistoryItem}.
 */
export interface WorkoutHistoryItemProps {
  /** Session shown in the row. */
  session: WorkoutSession;
  /** Opens the workout detail. */
  onPress: () => void;
  /** Extra classes for layout adjustments from the parent. */
  className?: string;
}

/**
 * Renders one historical workout with volume, duration and exercise count.
 *
 * @example
 * ```tsx
 * <WorkoutHistoryItem session={session} onPress={openDetail} />
 * ```
 */
export function WorkoutHistoryItem({
  session,
  onPress,
  className,
}: WorkoutHistoryItemProps) {
  const minutes = sessionDurationMinutes(session);
  const exerciseCount = recordedExerciseCount(session);
  const exerciseMeta =
    exerciseCount === 0
      ? 'Sin registros'
      : `${exerciseCount} ${exerciseCount === 1 ? 'ejercicio' : 'ejercicios'}`;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${session.dayLabel}, ${statusLabel(session.status)}`}
      onPress={onPress}
      className={cn('active:opacity-80', className)}
    >
      <Card className="gap-md">
        <View className="flex-row items-center justify-between gap-md">
          <Text variant="body-m" tone="secondary">
            {formatWorkoutHistoryDate(session.scheduledFor, 'list')}
          </Text>
          <Badge
            label={statusLabel(session.status)}
            tone={badgeTone[session.status]}
          />
        </View>
        <View className="flex-row items-center justify-between gap-md">
          <Text variant="title" className="flex-1" numberOfLines={2}>
            {session.dayLabel}
          </Text>
          <Icon name="chevron_right" size={16} className="text-content-muted" />
        </View>
        <View className="flex-row flex-wrap gap-xl">
          <View className="flex-row items-center gap-xs">
            <Icon
              name="open_in_full"
              size={16}
              className="text-content-muted"
            />
            <Text variant="body-m" tone="secondary">
              {formatVolumeKg(Number(session.totalVolumeKg || 0))}
            </Text>
          </View>
          <View className="flex-row items-center gap-xs">
            <Icon name="schedule" size={16} className="text-content-muted" />
            <Text variant="body-m" tone="secondary">
              {minutes === undefined ? '—' : `${minutes} min`}
            </Text>
          </View>
          <View className="flex-row items-center gap-xs">
            <Icon name="list_alt" size={16} className="text-content-muted" />
            <Text variant="body-m" tone="secondary">
              {exerciseMeta}
            </Text>
          </View>
        </View>
      </Card>
    </Pressable>
  );
}
