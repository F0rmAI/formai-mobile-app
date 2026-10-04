/**
 * Section header primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Pressable, View } from 'react-native';
import { cn } from '@/utils/cn';
import { Badge } from './Badge';
import { Text } from './Text';

/**
 * Props accepted by {@link SectionHeader}.
 */
export interface SectionHeaderProps {
  /** Title of the section. */
  title: string;
  /** Text of the counter badge, such as `14 workouts`. */
  count?: string;
  /** Label of the action shown at the end. */
  actionLabel?: string;
  /** Called when the action is activated. */
  onAction?: () => void;
  /** Extra classes for layout adjustments from the parent. */
  className?: string;
}

/**
 * Renders a section heading with an optional counter and action.
 *
 * @example
 * ```tsx
 * <SectionHeader title="Recent workouts" count="14 workouts" actionLabel="See all" onAction={openAll} />
 * ```
 */
export function SectionHeader({
  title,
  count,
  actionLabel,
  onAction,
  className,
}: SectionHeaderProps) {
  return (
    <View className={cn('w-full flex-row items-center gap-md', className)}>
      <Text variant="title" accessibilityRole="header" numberOfLines={1}>
        {title}
      </Text>
      {count && <Badge label={count} className="self-center" />}
      <View className="flex-1" />
      {actionLabel && (
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={onAction}
          className="active:opacity-70"
        >
          <Text variant="label-m-bold" tone="primary-bright">
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
