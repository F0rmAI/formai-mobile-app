/**
 * Empty state primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { View } from 'react-native';
import type { EmptyStateTone, IconName } from '@/types/ui';
import { cn } from '@/utils/cn';
import { Button } from './Button';
import { Icon } from './Icon';
import { Text } from './Text';

const toneStyles: Record<EmptyStateTone, { tile: string; icon: string }> = {
  primary: { tile: 'bg-primary-container', icon: 'text-primary' },
  error: { tile: 'bg-error-container', icon: 'text-error' },
};

/**
 * Props accepted by {@link EmptyState}.
 */
export interface EmptyStateProps {
  /** Main message. */
  title: string;
  /** Supporting text shown below the title. */
  description?: string;
  /**
   * Icon shown in the tile.
   *
   * @defaultValue `'inbox'`
   */
  icon?: IconName;
  /**
   * Color of the icon and its tile.
   *
   * @defaultValue `'primary'`
   */
  tone?: EmptyStateTone;
  /** Button shown below the text. */
  action?: { label: string; icon?: IconName; onPress: () => void };
  /** Extra classes for layout adjustments from the parent. */
  className?: string;
}

/**
 * Renders a centered empty state with an optional action.
 *
 * @example
 * ```tsx
 * <EmptyState icon="event_busy" title="No routine yet" description="It will show up here." />
 * ```
 */
export function EmptyState({
  title,
  description,
  icon = 'inbox',
  tone = 'primary',
  action,
  className,
}: EmptyStateProps) {
  const styles = toneStyles[tone];

  return (
    <View className={cn('w-full items-center gap-lg px-xl py-2xl', className)}>
      <View
        className={cn(
          'size-16 items-center justify-center rounded-lg',
          styles.tile,
        )}
      >
        <Icon name={icon} size={24} className={styles.icon} />
      </View>
      <Text variant="title" className="text-center">
        {title}
      </Text>
      {description && (
        <Text variant="body-l" tone="secondary" className="text-center">
          {description}
        </Text>
      )}
      {action && (
        <Button
          label={action.label}
          icon={action.icon}
          size="md"
          className="self-center"
          onPress={action.onPress}
        />
      )}
    </View>
  );
}
