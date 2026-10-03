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
  /** Icon shown in the top tile. */
  icon: IconName;
  /** Change from the previous comparable period, when available. */
  delta?: string;
  /** Extra classes for layout adjustments from the parent. */
  className?: string;
}

/**
 * Renders one progress statistic.
 *
 * @example
 * ```tsx
 * <StatCard label="Maximum load" value="34 kg" caption="Press" icon="military_tech" />
 * ```
 */
export function StatCard({
  label,
  value,
  caption,
  icon,
  delta,
  className,
}: StatCardProps) {
  return (
    <Card className={cn('flex-1 gap-md', className)}>
      <View className="flex-row items-start justify-between">
        <View className="size-9 items-center justify-center rounded-md bg-primary-container">
          <Icon name={icon} size={16} className="text-primary" />
        </View>
        {delta && (
          <View className="flex-row items-center gap-xs">
            <Icon
              name={delta.startsWith('-') ? 'trending_down' : 'trending_up'}
              size={16}
              className={
                delta.startsWith('-')
                  ? 'text-content-secondary'
                  : 'text-tertiary'
              }
            />
            <Text
              variant="label-m"
              tone={delta.startsWith('-') ? 'secondary' : 'tertiary'}
            >
              {delta}
            </Text>
          </View>
        )}
      </View>
      <Text variant="label-m" tone="secondary">
        {label}
      </Text>
      <Text variant="headline">{value}</Text>
      <Text variant="body-m" tone="muted">
        {caption}
      </Text>
    </Card>
  );
}
