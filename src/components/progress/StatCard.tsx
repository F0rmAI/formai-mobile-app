/**
 * Compact metric card for the progress dashboard.
 *
 * @author Christian
 * @packageDocumentation
 */

import { View } from 'react-native';
import { Card, Icon, Text } from '@/components/ui';
import type { IconName } from '@/types/ui';
import { cn } from '@/utils/cn';

/**
 * Props accepted by {@link StatCard}.
 */
export interface StatCardProps {
  /** Short metric label. */
  label: string;
  /** Primary numeric or formatted value. */
  value: string;
  /** Supporting caption under the value. */
  caption: string;
  /** Icon shown in the top-right tile. */
  icon: IconName;
  /** Extra classes for layout adjustments from the parent. */
  className?: string;
}

/**
 * Renders one progress statistic.
 *
 * @example
 * ```tsx
 * <StatCard label="Sesiones" value="8" caption="En 4 semanas" icon="fitness_center" />
 * ```
 */
export function StatCard({
  label,
  value,
  caption,
  icon,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('flex-1 gap-md', className)}>
      <View className="flex-row items-start justify-between">
        <Text variant="label-m" tone="secondary">
          {label}
        </Text>
        <View className="size-9 items-center justify-center rounded-md bg-primary-container">
          <Icon name={icon} size={16} className="text-primary" />
        </View>
      </View>
      <Text variant="headline">{value}</Text>
      <Text variant="body-m" tone="muted">
        {caption}
      </Text>
    </Card>
  );
}
