/**
 * Icon button primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Pressable, type PressableProps } from 'react-native';
import type { IconButtonVariant, IconName } from '@/types/ui';
import { cn } from '@/utils/cn';
import { Icon } from './Icon';

/**
 * Props accepted by {@link IconButton}.
 */
export interface IconButtonProps
  extends Omit<PressableProps, 'children' | 'style'> {
  icon: IconName;
  label: string;
  variant?: IconButtonVariant;
  className?: string;
}

/**
 * Renders a circular 40 px button that shows only an icon.
 *
 * @example
 * ```tsx
 * <IconButton icon="tune" label="Filters" onPress={openFilters} />
 * ```
 */
export function IconButton({
  icon,
  label,
  variant = 'tonal',
  className,
  ...props
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={4}
      className={cn(
        'size-10 items-center justify-center rounded-full active:opacity-80 disabled:opacity-50',
        variant === 'tonal'
          ? 'bg-surface-container'
          : 'bg-surface-card shadow-raised',
        className,
      )}
      {...props}
    >
      <Icon
        name={icon}
        size={20}
        className={
          variant === 'tonal' ? 'text-primary' : 'text-content-primary'
        }
      />
    </Pressable>
  );
}
