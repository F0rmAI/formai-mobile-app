/**
 * Compact recorded-set tile for workout detail.
 *
 * @author Christian
 * @packageDocumentation
 */

import { View } from 'react-native';
import { Text } from '@/components/ui';
import { cn } from '@/utils/cn';

/**
 * Props accepted by {@link SetSummaryTile}.
 */
export interface SetSummaryTileProps {
  /** One-based set number. */
  setNumber: number;
  /** Recorded load in kilograms. */
  loadKg: number;
  /** Recorded repetitions. */
  reps: number;
  /** Extra classes for layout adjustments from the parent. */
  className?: string;
}

/**
 * Renders one recorded set as load × reps.
 *
 * @example
 * ```tsx
 * <SetSummaryTile setNumber={1} loadKg={40} reps={10} />
 * ```
 */
export function SetSummaryTile({
  setNumber,
  loadKg,
  reps,
  className,
}: SetSummaryTileProps) {
  return (
    <View
      accessibilityLabel={`Serie ${setNumber}: ${loadKg} kilogramos, ${reps} repeticiones`}
      className={cn(
        'grow basis-0 gap-xs rounded-md bg-surface-container-low px-md py-md',
        className,
      )}
    >
      <Text variant="label-m" tone="muted">{`Serie ${setNumber} ✓`}</Text>
      <Text variant="title">{`${loadKg} kg`}</Text>
      <Text variant="body-m" tone="secondary">{`${reps} reps`}</Text>
    </View>
  );
}
