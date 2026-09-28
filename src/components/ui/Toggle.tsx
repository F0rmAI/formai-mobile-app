import { Pressable, View } from 'react-native';
import { cn } from '@/utils/cn';

export interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** Texto accesible del interruptor. */
  label: string;
  disabled?: boolean;
  className?: string;
}

/** Interruptor on/off de 46×26. */
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
