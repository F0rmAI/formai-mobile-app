/**
 * Toggle primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Pressable, View } from 'react-native';
import { cn } from '@/utils/cn';

/**
 * Props accepted by {@link Toggle}.
 */
export interface ToggleProps {
  /** Whether the switch is on. */
  checked: boolean;
  /** Called with the new state. */
  onChange: (checked: boolean) => void;
  /** Accessible label of the switch. */
  label: string;
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
 * Renders an on/off switch.
 *
 * @example
 * ```tsx
 * <Toggle label="Notifications" checked={enabled} onChange={setEnabled} />
 * ```
 */
export function Toggle({
  checked,
  onChange,
  label,
  disabled = false,
  className,
}: ToggleProps) {
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked, disabled }}
      accessibilityLabel={label}
      disabled={disabled}
      hitSlop={8}
      onPress={() => onChange(!checked)}
      className={cn(
        'h-[26px] w-[46px] rounded-full disabled:opacity-50',
        checked ? 'bg-primary-bright' : 'bg-surface-container-high',
        className,
      )}
    >
      <View
        className={cn(
          'absolute top-[3px] size-5 rounded-full bg-white',
          checked ? 'left-[23px]' : 'left-[3px]',
        )}
      />
    </Pressable>
  );
}
