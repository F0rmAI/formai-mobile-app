import { View } from 'react-native';
import type { IconName } from '@/types/ui';
import { cn } from '@/utils/cn';
import { Button } from './Button';
import { Icon } from './Icon';
import { Text } from './Text';

export interface EmptyStateProps {
  title: string;
  description?: string;
  icon?: IconName;
  action?: { label: string; icon?: IconName; onPress: () => void };
  className?: string;
}

/** Estado vacío centrado con acción opcional. */
export function EmptyState({
  title,
  description,
  icon = 'inbox',
  action,
  className,
}: EmptyStateProps) {
  return (
    <View className={cn('w-full items-center gap-lg px-xl py-2xl', className)}>
      <View className="size-16 items-center justify-center rounded-lg bg-primary-container">
        <Icon name={icon} size={24} />
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
