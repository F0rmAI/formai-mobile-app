import { View } from 'react-native';
import type { ProgressTone } from '@/types/ui';
import { cn } from '@/utils/cn';

export interface ProgressBarProps {
  /** Progreso de 0 a 100. */
  value: number;
  tone?: ProgressTone;
  /** Texto accesible. */
  label?: string;
  className?: string;
}

/** Track primary/container + relleno. `gradient` = primary → secondary. */
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
