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

export interface SectionLabelProps extends Omit<ViewProps, 'children'> {
  label: string;
  tone?: SectionLabelTone;
  /** Si se indica, reemplaza el punto inicial por este ícono. */
  icon?: IconName;
  className?: string;
}

/** Overline de sección con punto o ícono inicial. */
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
