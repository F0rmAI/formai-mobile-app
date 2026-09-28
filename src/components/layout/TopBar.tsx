import { View } from 'react-native';
import { IconButton, Text } from '@/components/ui';
import type { IconName } from '@/types/ui';
import { cn } from '@/utils/cn';

export interface TopBarProps {
  title: string;
  /** Si se indica, muestra el botón de volver. */
  onBack?: () => void;
  action?: { icon: IconName; label: string; onPress: () => void };
  className?: string;
}

/** Barra superior de pantallas internas (64 px). */
export function TopBar({ title, onBack, action, className }: TopBarProps) {
  return (
    <View
      className={cn(
        'h-16 w-full flex-row items-center gap-md bg-surface-background px-xl',
        className,
      )}
    >
      {onBack && (
        <IconButton icon="arrow_back" label="Volver" onPress={onBack} />
      )}
      <Text
        variant="title"
        accessibilityRole="header"
        numberOfLines={1}
        className="flex-1"
      >
        {title}
      </Text>
      {action && (
        <IconButton
          icon={action.icon}
          label={action.label}
          onPress={action.onPress}
        />
      )}
    </View>
  );
}
