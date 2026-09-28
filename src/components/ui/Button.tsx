import {
  ActivityIndicator,
  Pressable,
  type PressableProps,
} from 'react-native';
import type { ButtonSize, ButtonVariant, IconName, TextTone } from '@/types/ui';
import { cn } from '@/utils/cn';
import { Icon } from './Icon';
import { Text } from './Text';

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-primary-bright shadow-glow-primary',
  accent: 'bg-secondary shadow-glow-secondary',
  secondary: 'border border-line-subtle bg-surface-card shadow-card',
  ghost: 'bg-transparent',
  danger: 'bg-error',
};

const sizeClass: Record<ButtonSize, string> = {
  lg: 'h-14 rounded-md px-2xl',
  md: 'h-12 rounded-md px-2xl',
  sm: 'h-8 rounded-full px-xl',
};

const labelTone: Record<ButtonVariant, TextTone> = {
  primary: 'on-primary',
  accent: 'on-primary',
  secondary: 'default',
  ghost: 'primary-bright',
  danger: 'on-primary',
};

const iconColor: Record<ButtonVariant, string> = {
  primary: 'text-content-on-primary',
  accent: 'text-content-on-primary',
  secondary: 'text-primary',
  ghost: 'text-primary-bright',
  danger: 'text-content-on-primary',
};

/** Color del ActivityIndicator (Uniwind usa el prefijo accent- para props de color). */
const spinnerColor: Record<ButtonVariant, string> = {
  primary: 'accent-content-on-primary',
  accent: 'accent-content-on-primary',
  secondary: 'accent-primary',
  ghost: 'accent-primary-bright',
  danger: 'accent-content-on-primary',
};

export interface ButtonProps
  extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  /** Por defecto `primary` (color principal del design system). */
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Ícono a la izquierda del texto. */
  icon?: IconName;
  fullWidth?: boolean;
  loading?: boolean;
  className?: string;
}

export function Button({
  label,
  variant = 'primary',
  size = 'lg',
  icon,
  fullWidth = false,
  loading = false,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = Boolean(disabled || loading);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      disabled={isDisabled}
      className={cn(
        'flex-row items-center justify-center gap-md active:opacity-90 disabled:opacity-50',
        variantClass[variant],
        sizeClass[size],
        fullWidth ? 'w-full' : 'self-start',
        className,
      )}
      {...props}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          colorClassName={spinnerColor[variant]}
        />
      ) : (
        icon && (
          <Icon
            name={icon}
            size={size === 'sm' ? 16 : 20}
            className={iconColor[variant]}
          />
        )
      )}
      <Text variant="label-l" tone={labelTone[variant]} numberOfLines={1}>
        {label}
      </Text>
    </Pressable>
  );
}
