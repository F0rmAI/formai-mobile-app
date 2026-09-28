import { Pressable, View } from 'react-native';
import { cn } from '@/utils/cn';
import { Icon } from './Icon';
import { Text } from './Text';

export interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

/** Casilla con texto. */
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
