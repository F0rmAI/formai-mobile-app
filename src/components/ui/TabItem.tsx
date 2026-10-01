/**
 * Tab item primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Pressable, type PressableProps } from 'react-native';
import { cn } from '@/utils/cn';
import { Text } from './Text';

/**
 * Props accepted by {@link TabItem}.
 */
export interface TabItemProps
  extends Omit<PressableProps, 'children' | 'style'> {
  label: string;
  active?: boolean;
  className?: string;
}

/**
 * Renders one tab of an in-page tab bar.
 *
 * @example
 * ```tsx
 * <TabItem label="Profile" active={tab === 'profile'} onPress={() => setTab('profile')} />
 * ```
 */
export function TabItem({
  label,
  active = false,
  className,
  ...props
}: TabItemProps) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      className={cn(
        'border-b-2 px-xs py-lg',
        active ? 'border-primary' : 'border-transparent',
        className,
      )}
      {...props}
    >
      <Text
        variant={active ? 'label-l' : 'body-l-strong'}
        tone={active ? 'primary' : 'secondary'}
      >
        {label}
      </Text>
    </Pressable>
  );
}
