/**
 * Navigation item layout component.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Pressable, type PressableProps } from 'react-native';
import { Icon, Text } from '@/components/ui';
import type { IconName } from '@/types/ui';
import { cn } from '@/utils/cn';

/**
 * Props accepted by {@link NavItem}.
 */
export interface NavItemProps
  extends Omit<PressableProps, 'children' | 'style'> {
  icon: IconName;
  label: string;
  active?: boolean;
  className?: string;
}

/**
 * Renders one tab of the bottom navigation.
 *
 * @example
 * ```tsx
 * <NavItem icon="person" label="Profile" active onPress={openProfile} />
 * ```
 */
export function NavItem({
  icon,
  label,
  active = false,
  className,
  ...props
}: NavItemProps) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      accessibilityLabel={label}
      className={cn(
        'flex-1 items-center justify-center gap-xs px-md py-xs active:opacity-70',
        className,
      )}
      {...props}
    >
      <Icon
        name={icon}
        size={24}
        className={active ? 'text-primary-bright' : 'text-content-secondary'}
      />
      <Text
        variant={active ? 'label-m-bold' : 'label-m'}
        tone={active ? 'primary-bright' : 'secondary'}
        numberOfLines={1}
      >
        {label}
      </Text>
    </Pressable>
  );
}
