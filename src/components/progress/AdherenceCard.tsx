/**
 * Adherence summary card for the progress dashboard.
 *
 * @author Christian
 * @packageDocumentation
 */

import { View } from 'react-native';
import { Badge, Card, ProgressBar, Text } from '@/components/ui';
import { cn } from '@/utils/cn';

/**
 * Props accepted by {@link AdherenceCard}.
 */
export interface AdherenceCardProps {
  /** Adherence percentage from 0 to 100. */
  percentage: number;
  /** Completed sessions in the window. */
  completedCount: number;
  /** Count of completed, partial and skipped sessions. */
  scheduledCount: number;
  /** Extra classes for layout adjustments from the parent. */
  className?: string;
}

/**
 * Renders adherence with a progress bar and session counts.
 *
 * @example
 * ```tsx
 * <AdherenceCard percentage={75} completedCount={6} scheduledCount={8} />
 * ```
 */
export function AdherenceCard({
  percentage,
  completedCount,
  scheduledCount,
  className,
}: AdherenceCardProps) {
  const label =
    percentage % 1 === 0 ? `${percentage} %` : `${percentage.toFixed(1)} %`;
  return (
    <Card className={cn('gap-md', className)}>
      <View className="flex-row items-center justify-between">
        <Text variant="title">Adherencia</Text>
        <Badge label={label} tone="tertiary" />
      </View>
      <ProgressBar value={percentage} label="Adherencia" />
      <Text variant="body-m" tone="secondary">
        {scheduledCount === 0
          ? 'Aún no hay sesiones en este periodo.'
          : `${completedCount} de ${scheduledCount} ${
              scheduledCount === 1 ? 'sesión' : 'sesiones'
            } completadas`}
      </Text>
    </Card>
  );
}
