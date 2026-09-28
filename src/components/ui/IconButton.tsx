import { Pressable, type PressableProps } from 'react-native';
import type { IconButtonVariant, IconName } from '@/types/ui';
import { cn } from '@/utils/cn';
import { Icon } from './Icon';

export interface IconButtonProps
  extends Omit<PressableProps, 'children' | 'style'> {
  icon: IconName;
  /** Texto accesible (obligatorio: el botón no tiene texto visible). */
  label: string;
  variant?: IconButtonVariant;
  className?: string;
}

/** Botón circular de 40 px. */
export function IconButton({
  icon,
  label,
  variant = 'tonal',
  className,
  ...props
}: IconButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      hitSlop={4}
      className={cn(
        'size-10 items-center justify-center rounded-full active:opacity-80 disabled:opacity-50',
        variant === 'tonal'
          ? 'bg-surface-container'
          : 'bg-surface-card shadow-raised',
        className,
      )}
      {...props}
    >
      <Icon
        name={icon}
        size={20}
        className={
          variant === 'tonal' ? 'text-primary' : 'text-content-primary'
        }
      />
    </Pressable>
  );
}
