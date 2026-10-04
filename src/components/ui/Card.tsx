/**
 * Card primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { View, type ViewProps } from 'react-native';
import type { Elevation } from '@/types/ui';
import { cn } from '@/utils/cn';

const elevationClass: Record<Elevation, string> = {
  none: '',
  card: 'shadow-card',
  soft: 'shadow-soft',
  raised: 'shadow-raised',
  floating: 'shadow-floating',
};

/**
 * Props accepted by {@link Card}.
 */
export interface CardProps extends ViewProps {
  /**
   * Shadow level.
   *
   * @defaultValue `'card'`
   */
  elevation?: Elevation;
  /** Extra classes for layout adjustments from the parent. */
  className?: string;
}

/**
 * Renders the base surface: card background, large radius and standard padding.
 *
 * @example
 * ```tsx
 * <Card elevation="soft">{children}</Card>
 * ```
 */
export function Card({ elevation = 'card', className, ...props }: CardProps) {
  return (
    <View
      className={cn(
        'rounded-lg bg-surface-card p-xl',
        elevationClass[elevation],
        className,
      )}
      {...props}
    />
  );
}
