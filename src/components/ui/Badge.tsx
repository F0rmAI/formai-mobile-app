import { View, type ViewProps } from 'react-native';
import type { BadgeTone, IconName, TextTone } from '@/types/ui';
import { cn } from '@/utils/cn';
import { Icon } from './Icon';
import { Text } from './Text';

const toneClass: Record<
  BadgeTone,
  { container: string; icon: string; text: TextTone }
> = {
  primary: {
    container: 'bg-primary-container',
    icon: 'text-primary',
    text: 'primary',
  },
  secondary: {
    container: 'bg-secondary-container',
    icon: 'text-secondary-text',
    text: 'accent',
  },
  tertiary: {
    container: 'bg-tertiary-container',
    icon: 'text-tertiary',
    text: 'tertiary',
  },
  neutral: {
    container: 'bg-surface-container',
    icon: 'text-content-secondary',
    text: 'secondary',
  },
  strong: {
    container: 'bg-secondary-text',
    icon: 'text-content-on-primary',
    text: 'on-primary',
  },
};

export interface BadgeProps extends Omit<ViewProps, 'children'> {
  label: string;
  tone?: BadgeTone;
  icon?: IconName;
  className?: string;
}

/** Estado o dato corto. */
export function Badge({
  label,
  tone = 'primary',
  icon,
  className,
  ...props
}: BadgeProps) {
  const styles = toneClass[tone];

  return (
    <View
      className={cn(
        'flex-row items-center gap-xs self-start rounded-full px-md py-2xs',
        styles.container,
        className,
      )}
      {...props}
    >
      {icon && <Icon name={icon} size={16} className={styles.icon} />}
      <Text variant="label-m-bold" tone={styles.text} numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
}
