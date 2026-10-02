import { View } from 'react-native';
import type { EmptyStateTone, IconName } from '@/types/ui';
import { cn } from '@/utils/cn';
import { Button } from './Button';
import { Icon } from './Icon';
import { Text } from './Text';

const toneStyles: Record<EmptyStateTone, { tile: string; icon: string }> = {
  primary: { tile: 'bg-primary-container', icon: 'text-primary' },
  error: { tile: 'bg-error-container', icon: 'text-error' },
};

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: IconName;
  /** Color del ícono y de su recuadro. */
  tone?: EmptyStateTone;
  action?: { label: string; icon?: IconName; onPress: () => void };
  className?: string;
}

/** Estado vacío centrado con acción opcional. */
export function EmptyState({
  title,
  description,
  icon = 'inbox',
  tone = 'primary',
  action,
  className,
}: EmptyStateProps) {
  const styles = toneStyles[tone];

  return (
    <View className={cn('w-full items-center gap-lg px-xl py-2xl', className)}>
      <View
        className={cn(
          'size-16 items-center justify-center rounded-lg',
          styles.tile,
        )}
      >
        <Icon name={icon} size={24} className={styles.icon} />
      </View>
      <Text variant="title" className="text-center">
        {title}
      </Text>
      {description && (
        <Text variant="body-l" tone="secondary" className="text-center">
          {description}
        </Text>
      )}
      {action && (
        <Button
          label={action.label}
          icon={action.icon}
          size="md"
          className="self-center"
          onPress={action.onPress}
        />
      )}
    </View>
  );
}
