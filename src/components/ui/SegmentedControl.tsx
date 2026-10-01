/**
 * Segmented control primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Pressable, View } from 'react-native';
import type { SegmentOption } from '@/types/ui';
import { cn } from '@/utils/cn';
import { Text } from './Text';

/**
 * Props accepted by {@link SegmentedControl}.
 *
 * @typeParam T - Union of the option values.
 */
export interface SegmentedControlProps<T extends string> {
  /** Options shown, in order. */
  options: SegmentOption<T>[];
  /** Value of the selected option. */
  value: T;
  /** Called with the value of the option the user selects. */
  onChange: (value: T) => void;
  /** Accessible label of the group. */
  label?: string;
  /** Extra classes for layout adjustments from the parent. */
  className?: string;
}

/**
 * Renders a single-choice selector with all options visible.
 *
 * @typeParam T - Union of the option values.
 *
 * @example
 * ```tsx
 * <SegmentedControl options={periods} value={period} onChange={setPeriod} />
 * ```
 */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: SegmentedControlProps<T>) {
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      className={cn(
        'flex-row items-center gap-xs self-start rounded-full bg-surface-container-low p-xs',
        className,
      )}
    >
      {options.map(option => {
        const selected = option.value === value;
        return (
          <Pressable
            key={option.value}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(option.value)}
            className={cn(
              'h-9 items-center justify-center rounded-full px-xl',
              selected ? 'bg-surface-card shadow-card' : 'bg-transparent',
            )}
          >
            <Text
              variant={selected ? 'label-l' : 'body-l-strong'}
              tone={selected ? 'primary' : 'secondary'}
              numberOfLines={1}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
