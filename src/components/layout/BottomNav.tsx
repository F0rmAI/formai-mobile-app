import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { IconName } from '@/types/ui';
import { cn } from '@/utils/cn';
import { NavItem } from './NavItem';

export interface BottomNavItem<K extends string = string> {
  key: K;
  label: string;
  icon: IconName;
}

export interface BottomNavProps<K extends string> {
  items: BottomNavItem<K>[];
  activeKey: K;
  onChange: (key: K) => void;
  className?: string;
}

/** Navegación inferior (MVP: Hoy, Progreso, Perfil · TB2 agrega Escanear). */
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
