/**
 * Icon primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Text, type TextProps } from 'react-native';
import type { IconName, IconSize } from '@/types/ui';
import { cn } from '@/utils/cn';

/**
 * Props accepted by {@link Icon}.
 */
export interface IconProps extends Omit<TextProps, 'children'> {
  /** Ligature name of the icon, such as `bolt`. */
  name: IconName;
  /**
   * Size in pixels.
   *
   * @defaultValue `20`
   */
  size?: IconSize;
  /** Accessible label; when omitted the icon is decorative. */
  label?: string;
  /** Extra classes; use a text color utility to change the color. */
  className?: string;
}

/**
 * Renders a Material Symbols Rounded icon, using the primary color by default.
 *
 * @example
 * ```tsx
 * <Icon name="bolt" size={24} />
 * ```
 */
export function Icon({
  name,
  size = 20,
  label,
  className,
  style,
  ...props
}: IconProps) {
  return (
    <Text
      accessible={Boolean(label)}
      accessibilityLabel={label}
      accessibilityRole={label ? 'image' : undefined}
      importantForAccessibility={label ? 'auto' : 'no-hide-descendants'}
      allowFontScaling={false}
      className={cn('font-icon text-center text-primary', className)}
      style={[
        { fontSize: size, lineHeight: size, width: size, height: size },
        style,
      ]}
      {...props}
    >
      {name}
    </Text>
  );
}
