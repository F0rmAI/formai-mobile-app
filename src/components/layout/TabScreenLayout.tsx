import type { ReactNode } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui';
import { cn } from '@/utils/cn';
import { AppHeader, type AppHeaderProps } from './AppHeader';

export interface TabScreenLayoutProps {
  /** Texto bajo la marca en el header (p. ej. "Entrenamiento de hoy"). */
  headerSubtitle: string;
  user?: AppHeaderProps['user'];
  title: string;
  subtitle?: string;
  children?: ReactNode;
  className?: string;
}

/**
 * Estructura de las pantallas con navegación inferior: header de marca, título
 * y contenido desplazable con espacio para que el `BottomNav` no lo tape.
 */
export function TabScreenLayout({
  headerSubtitle,
  user,
  title,
  subtitle,
  children,
  className,
}: TabScreenLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={cn('flex-1 bg-surface-background', className)}
      style={{ paddingTop: insets.top }}
    >
      <AppHeader subtitle={headerSubtitle} user={user} />
      <ScrollView contentContainerClassName="gap-xl px-xl pt-xl pb-page-bottom">
        <View className="gap-xs">
          <Text variant="display" accessibilityRole="header">
            {title}
          </Text>
          {subtitle && (
            <Text variant="body-l" tone="secondary">
              {subtitle}
            </Text>
          )}
        </View>
        {children}
        <View style={{ height: insets.bottom }} />
      </ScrollView>
    </View>
  );
}
