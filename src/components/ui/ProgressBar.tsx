/**
 * Progress bar primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { View } from 'react-native';
import type { ProgressTone } from '@/types/ui';
import { cn } from '@/utils/cn';

/**
 * Props accepted by {@link ProgressBar}.
 */
export interface ProgressBarProps {
  /** Progress from 0 to 100; values outside the range are clamped. */
  value: number;
  /**
   * Fill style.
   *
   * @defaultValue `'primary'`
   */
  tone?: ProgressTone;
  /** Accessible label. */
  label?: string;
  /** Extra classes for layout adjustments from the parent. */
  className?: string;
}

/**
 * Renders a horizontal progress bar.
 *
 * @example
 * ```tsx
 * <ProgressBar value={60} label="Weekly goal" />
 * ```
 */
export function ProgressBar({
  value,
  tone = 'primary',
  label,
  className,
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <View
      accessibilityRole="progressbar"
      accessibilityLabel={label}
      accessibilityValue={{ min: 0, max: 100, now: clamped }}
      className={cn(
        'h-2 w-full overflow-hidden rounded-full bg-primary-container',
        className,
      )}
    >
      <View
        className={cn(
          'h-full rounded-full',
          tone === 'gradient'
            ? 'bg-linear-to-r from-primary to-secondary'
            : 'bg-primary',
        )}
        style={{ width: `${clamped}%` }}
      />
    </View>
  );
}
