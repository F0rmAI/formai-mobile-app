import { Pressable, View } from 'react-native';
import { cn } from '@/utils/cn';
import { Badge } from './Badge';
import { Text } from './Text';

export interface SectionHeaderProps {
  title: string;
  /** Texto del Badge contador (p. ej. "14 entrenamientos"). */
  count?: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

/** Encabezado de sección con contador y acción opcionales. */
export function SectionHeader({
  title,
  count,
  actionLabel,
  onAction,
  className,
}: SectionHeaderProps) {
  return (
    <View className={cn('w-full flex-row items-center gap-md', className)}>
      <Text variant="title" accessibilityRole="header" numberOfLines={1}>
        {title}
      </Text>
      {count && <Badge label={count} className="self-center" />}
      <View className="flex-1" />
      {actionLabel && (
        <Pressable
          accessibilityRole="button"
          hitSlop={8}
          onPress={onAction}
          className="active:opacity-70"
        >
          <Text variant="label-m-bold" tone="primary-bright">
            {actionLabel}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
