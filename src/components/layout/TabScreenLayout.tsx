/**
 * Scrollable layout for main tab screens.
 *
 * @author Carlos
 * @packageDocumentation
 */

import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@/components/ui';
import { cn } from '@/utils/cn';
import { AppHeader, type AppHeaderProps } from './AppHeader';

/**
 * Props accepted by {@link TabScreenLayout}.
 */
export interface TabScreenLayoutProps {
  /** Text shown below the brand in the header. */
  headerSubtitle: string;
  /** Signed-in user shown in the header. */
  user?: AppHeaderProps['user'];
  /** Main screen heading. */
  title: string;
  /** Supporting text below the heading. */
  subtitle?: string;
  /** Scrollable screen content. */
  children?: ReactNode;
  /** Whether the screen is fetching fresh content. */
  refreshing?: boolean;
  /** Starts a pull-to-refresh request when provided. */
  onRefresh?: () => void;
  /** Extra classes for the outer container. */
  className?: string;
}

/**
 * Renders the branded tab header and scrollable content above the bottom navigation.
 *
 * @example
 * ```tsx
 * <TabScreenLayout headerSubtitle="Today" title="Workout">{content}</TabScreenLayout>
 * ```
 */
export function TabScreenLayout({
  headerSubtitle,
  user,
  title,
  subtitle,
  children,
  refreshing = false,
  onRefresh,
  className,
}: TabScreenLayoutProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className={cn('flex-1 bg-surface-background', className)}
      style={{ paddingTop: insets.top }}
    >
      <AppHeader subtitle={headerSubtitle} user={user} />
      <ScrollView
        contentContainerClassName="gap-xl px-xl pt-xl pb-page-bottom"
        refreshControl={
          onRefresh ? (
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColorClassName="accent-primary"
              colorsClassName="accent-primary"
            />
          ) : undefined
        }
      >
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
