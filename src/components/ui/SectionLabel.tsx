/**
 * Section label primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { View, type ViewProps } from 'react-native';
import type { IconName, SectionLabelTone, TextTone } from '@/types/ui';
import { cn } from '@/utils/cn';
import { Icon } from './Icon';
import { Text } from './Text';

const toneClass: Record<
  SectionLabelTone,
  { dot: string; icon: string; text: TextTone }
> = {
  primary: { dot: 'bg-primary', icon: 'text-primary', text: 'primary' },
  secondary: {
    dot: 'bg-secondary-text',
    icon: 'text-secondary-text',
    text: 'accent',
  },
  neutral: {
    dot: 'bg-content-secondary',
    icon: 'text-content-secondary',
    text: 'secondary',
  },
};

/**
 * Props accepted by {@link SectionLabel}.
 */
export interface SectionLabelProps extends Omit<ViewProps, 'children'> {
  /** Text shown in uppercase. */
  label: string;
  /**
   * Color tone.
   *
   * @defaultValue `'primary'`
   */
  tone?: SectionLabelTone;
  /** Icon that replaces the leading dot. */
  icon?: IconName;
  /** Extra classes for layout adjustments from the parent. */
  className?: string;
}

/**
 * Renders an overline label with a leading dot or icon.
 *
 * @example
 * ```tsx
 * <SectionLabel label="Current exercise" />
 * ```
 */
export function SectionLabel({
  label,
  tone = 'primary',
  icon,
  className,
  ...props
}: SectionLabelProps) {
  const styles = toneClass[tone];

  return (
    <View className={cn('flex-row items-center gap-sm', className)} {...props}>
      {icon ? (
        <Icon name={icon} size={16} className={styles.icon} />
      ) : (
        <View className={cn('size-1.5 rounded-full', styles.dot)} />
      )}
      <Text variant="overline" tone={styles.text} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}
