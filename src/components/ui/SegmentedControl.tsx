import { Pressable, View } from 'react-native';
import type { SegmentOption } from '@/types/ui';
import { cn } from '@/utils/cn';
import { Text } from './Text';

export interface SegmentedControlProps<T extends string> {
  options: SegmentOption<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Texto accesible del grupo. */
  label?: string;
  className?: string;
}

/** Selector de periodo u opción única. */
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
