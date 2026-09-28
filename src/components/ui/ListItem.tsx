import { Pressable, View, type PressableProps } from 'react-native';
import type { BadgeTone, IconName } from '@/types/ui';
import { cn } from '@/utils/cn';
import { Badge } from './Badge';
import { Icon } from './Icon';
import { Text } from './Text';

export interface ListItemProps
  extends Omit<PressableProps, 'children' | 'style'> {
  title: string;
  subtitle?: string;
  icon?: IconName;
  /** Texto de un Badge primary a la derecha. */
  badge?: string;
  badgeTone?: BadgeTone;
  showChevron?: boolean;
  className?: string;
}

/** Fila de lista navegable. */
export function ListItem({
  title,
  subtitle,
  icon,
  badge,
  badgeTone = 'primary',
  showChevron = true,
  className,
  ...props
}: ListItemProps) {
  return (
    <Pressable
      accessibilityRole="button"
      className={cn(
        'w-full flex-row items-center gap-xl rounded-lg bg-surface-card p-xl shadow-card active:bg-surface-container-low',
        className,
      )}
      {...props}
    >
      {icon && (
        <View className="size-10 items-center justify-center rounded-md bg-primary-container">
          <Icon name={icon} size={20} />
        </View>
      )}
      <View className="flex-1 gap-2xs">
        <Text variant="body-l-strong" numberOfLines={1}>
          {title}
        </Text>
        {subtitle && (
          <Text variant="body-m" tone="secondary" numberOfLines={1}>
            {subtitle}
          </Text>
        )}
      </View>
      {badge && (
        <Badge label={badge} tone={badgeTone} className="self-center" />
      )}
      {showChevron && (
        <Icon name="chevron_right" size={20} className="text-content-subtle" />
      )}
    </Pressable>
  );
}
