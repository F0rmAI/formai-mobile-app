/**
 * Top bar layout component.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { View } from 'react-native';
import { IconButton, Text } from '@/components/ui';
import type { IconName } from '@/types/ui';
import { cn } from '@/utils/cn';

/**
 * Props accepted by {@link TopBar}.
 */
export interface TopBarProps {
  /** Title of the screen. */
  title: string;
  /** Called when the back button is pressed; the button is hidden when omitted. */
  onBack?: () => void;
  /** Icon action shown at the end. */
  action?: { icon: IconName; label: string; onPress: () => void };
  /** Extra classes for layout adjustments from the parent. */
  className?: string;
}

/**
 * Renders the top bar of an inner screen.
 *
 * @example
 * ```tsx
 * <TopBar title="My routine" onBack={goBack} />
 * ```
 */
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
