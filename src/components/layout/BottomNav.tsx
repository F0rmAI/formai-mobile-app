/**
 * Bottom navigation layout component.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { IconName } from '@/types/ui';
import { cn } from '@/utils/cn';
import { NavItem } from './NavItem';

/**
 * Describes one tab of the bottom navigation.
 *
 * @typeParam K - Union of the tab identifiers.
 */
export interface BottomNavItem<K extends string = string> {
  /** Identifier reported when the tab is selected. */
  key: K;
  /** Text of the tab. */
  label: string;
  /** Icon shown above the label. */
  icon: IconName;
}

/**
 * Props accepted by {@link BottomNav}.
 *
 * @typeParam K - Union of the tab identifiers.
 */
export interface BottomNavProps<K extends string> {
  /** Tabs shown, in order. */
  items: BottomNavItem<K>[];
  /** Identifier of the current tab. */
  activeKey: K;
  /** Called with the identifier of the tab the user selects. */
  onChange: (key: K) => void;
  /** Extra classes for layout adjustments from the parent. */
  className?: string;
}

/**
 * Renders the bottom navigation bar and keeps it above the system gesture area.
 *
 * @typeParam K - Union of the tab identifiers.
 *
 * @example
 * ```tsx
 * <BottomNav items={tabs} activeKey={tab} onChange={setTab} />
 * ```
 */
export function BottomNav<K extends string>({
  items,
  activeKey,
  onChange,
  className,
}: BottomNavProps<K>) {
  const insets = useSafeAreaInsets();

  return (
    <View
      accessibilityRole="tablist"
      className={cn(
        'w-full flex-row items-center justify-between rounded-t-[24px] bg-surface-card px-xl pt-md shadow-nav',
        className,
      )}
      style={{ paddingBottom: Math.max(insets.bottom, 8) }}
    >
      {items.map(item => (
        <NavItem
          key={item.key}
          icon={item.icon}
          label={item.label}
          active={item.key === activeKey}
          onPress={() => onChange(item.key)}
        />
      ))}
    </View>
  );
}
