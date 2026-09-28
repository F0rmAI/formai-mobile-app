import { Pressable, type PressableProps } from 'react-native';
import type { IconName } from '@/types/ui';
import { cn } from '@/utils/cn';
import { Icon } from './Icon';
import { Text } from './Text';

export interface ChipProps extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  selected?: boolean;
  icon?: IconName;
  className?: string;
}

/** Chip seleccionable. */
export function Chip({
  label,
  selected = false,
  icon,
  className,
  ...props
}: ChipProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      className={cn(
        'h-9 flex-row items-center gap-sm self-start rounded-full px-xl active:opacity-80 disabled:opacity-50',
        selected ? 'bg-primary' : 'bg-surface-container',
        className,
      )}
      {...props}
    >
      {icon && (
        <Icon
          name={icon}
          size={16}
          className={
            selected ? 'text-content-on-primary' : 'text-content-secondary'
          }
        />
      )}
      <Text
        variant="body-l-strong"
        tone={selected ? 'on-primary' : 'secondary'}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}
