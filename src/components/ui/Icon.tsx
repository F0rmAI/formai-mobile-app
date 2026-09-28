import { Text, type TextProps } from 'react-native';
import type { IconName, IconSize } from '@/types/ui';
import { cn } from '@/utils/cn';

export interface IconProps extends Omit<TextProps, 'children'> {
  /** Ligadura de Material Symbols Rounded (p. ej. "bolt"). */
  name: IconName;
  size?: IconSize;
  /** Texto accesible; si se omite, el ícono es decorativo. */
  label?: string;
  className?: string;
}

/** Ícono Material Symbols Rounded (fuente por ligaduras). Color por defecto: primary. */
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
