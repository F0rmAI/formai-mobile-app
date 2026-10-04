/**
 * Removable date-range chip for workout history.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Pressable } from 'react-native';
import { Icon, Text } from '@/components/ui';

/** Props accepted by {@link HistoryDateRangeChip}. */
export interface HistoryDateRangeChipProps {
  /** Formatted date range shown in the chip. */
  label: string;
  /** Clears the active history filter. */
  onPress: () => void;
}

/** Shows the active date range with a clear action. */
export function HistoryDateRangeChip({
  label,
  onPress,
}: HistoryDateRangeChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Quitar filtro"
      onPress={onPress}
      className="flex-row items-center gap-sm rounded-full bg-surface-container-low px-lg py-sm active:opacity-80"
    >
      <Text variant="label-m">{label}</Text>
      <Icon name="close" size={16} className="text-content-secondary" />
    </Pressable>
  );
}
