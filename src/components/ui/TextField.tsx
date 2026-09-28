import { useState } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';
import type { IconName } from '@/types/ui';
import { cn } from '@/utils/cn';
import { Icon } from './Icon';
import { Text } from './Text';

export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  /** Texto de ayuda bajo el campo. */
  helper?: string;
  /** Mensaje de error: activa el estado Error y reemplaza al texto de ayuda. */
  error?: string;
  leadingIcon?: IconName;
  trailingIcon?: IconName;
  /** Acción del ícono final (p. ej. mostrar/ocultar contraseña). */
  onTrailingIconPress?: () => void;
  trailingIconLabel?: string;
  className?: string;
}

/** Campo de formulario. Ocupa todo el ancho disponible. */
export function TextField({
  label,
  helper,
  error,
  leadingIcon,
  trailingIcon,
  onTrailingIconPress,
  trailingIconLabel,
  className,
  onFocus,
  onBlur,
  ...props
}: TextFieldProps) {
  const [focused, setFocused] = useState(false);
  const hasError = Boolean(error);
  const message = error ?? helper;

  return (
    <View className={cn('w-full gap-sm', className)}>
      <Text variant="label-m-bold" tone="secondary">
        {label}
      </Text>

      <View
        className={cn(
          'h-12 flex-row items-center gap-md overflow-hidden rounded-md bg-surface-card px-xl',
          hasError
            ? 'border-[1.5px] border-error'
            : focused
            ? 'border-[1.5px] border-primary'
            : 'border border-line-outline',
        )}
      >
        {leadingIcon && (
          <Icon
            name={leadingIcon}
            size={20}
            className={hasError ? 'text-error' : 'text-content-muted'}
          />
        )}
        <TextInput
          accessibilityLabel={label}
          accessibilityHint={message}
          placeholderTextColorClassName="accent-content-muted"
          selectionColorClassName="accent-primary"
          className="h-full flex-1 p-0 font-sans text-body-l text-content-primary"
          onFocus={event => {
            setFocused(true);
            onFocus?.(event);
          }}
          onBlur={event => {
            setFocused(false);
            onBlur?.(event);
          }}
          {...props}
        />
        {trailingIcon &&
          (onTrailingIconPress ? (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={trailingIconLabel}
              hitSlop={8}
              onPress={onTrailingIconPress}
            >
              <Icon
                name={trailingIcon}
                size={20}
                className="text-content-muted"
              />
            </Pressable>
          ) : (
            <Icon
              name={trailingIcon}
              size={20}
              className="text-content-muted"
            />
          ))}
      </View>

      {message && (
        <View className="flex-row items-start gap-xs">
          <Icon
            name={hasError ? 'error' : 'info'}
            size={16}
            className={hasError ? 'text-error' : 'text-content-muted'}
          />
          <Text
            variant="body-m"
            tone={hasError ? 'error' : 'muted'}
            className="flex-1"
          >
            {message}
          </Text>
        </View>
      )}
    </View>
  );
}
