/**
 * Text field primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useState } from 'react';
import { Pressable, TextInput, View, type TextInputProps } from 'react-native';
import type { IconName } from '@/types/ui';
import { cn } from '@/utils/cn';
import { Icon } from './Icon';
import { Text } from './Text';

/**
 * Props accepted by {@link TextField}.
 */
export interface TextFieldProps extends Omit<TextInputProps, 'style'> {
  /** Label shown above the field. */
  label: string;
  /** Help text shown below the field. */
  helper?: string;
  /** Error message; switches the field to the error state and replaces the help text. */
  error?: string;
  /** Icon shown at the start of the field. */
  leadingIcon?: IconName;
  /** Icon shown at the end of the field. */
  trailingIcon?: IconName;
  /** Called when the trailing icon is activated, for example to toggle password visibility. */
  onTrailingIconPress?: () => void;
  /** Accessible label of the trailing icon action. */
  trailingIconLabel?: string;
  /** Extra classes for layout adjustments from the parent. */
  className?: string;
}

/**
 * Renders a labeled text input that fills the available width.
 *
 * @example
 * ```tsx
 * <TextField label="Email" leadingIcon="mail" error={errors.email} />
 * ```
 */
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
