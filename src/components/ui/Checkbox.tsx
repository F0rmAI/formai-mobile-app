/**
 * Checkbox primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Pressable, View } from 'react-native';
import { cn } from '@/utils/cn';
import { Icon } from './Icon';
import { Text } from './Text';

/**
 * Props accepted by {@link Checkbox}.
 */
export interface CheckboxProps {
  /** Text shown next to the box. */
  label: string;
  /** Whether the box is checked. */
  checked: boolean;
  /** Called with the new checked state. */
  onChange: (checked: boolean) => void;
  /**
   * Blocks interaction.
   *
   * @defaultValue `false`
   */
  disabled?: boolean;
  /** Extra classes for layout adjustments from the parent. */
  className?: string;
}

/**
 * Renders a checkbox with its label.
 *
 * @example
 * ```tsx
 * <Checkbox label="I accept the terms" checked={accepted} onChange={setAccepted} />
 * ```
 */
export function Checkbox({
  label,
  checked,
  onChange,
  disabled = false,
  className,
}: CheckboxProps) {
  return (
    <Pressable
      accessibilityRole="checkbox"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      onPress={() => onChange(!checked)}
      className={cn(
        'w-full flex-row items-start gap-lg disabled:opacity-50',
        className,
      )}
    >
      <View
        className={cn(
          'size-[22px] items-center justify-center rounded-sm',
          checked
            ? 'bg-primary'
            : 'border-[1.5px] border-line-outline bg-surface-card',
        )}
      >
        {checked && (
          <Icon name="check" size={16} className="text-content-on-primary" />
        )}
      </View>
      <Text variant="body-l" className="flex-1">
        {label}
      </Text>
    </Pressable>
  );
}
