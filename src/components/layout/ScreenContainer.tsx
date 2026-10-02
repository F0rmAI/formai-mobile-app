/**
 * Safe-area container for full-screen routes.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import type { ReactNode } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@/utils/cn';

/**
 * Props accepted by {@link ScreenContainer}.
 */
export interface ScreenContainerProps {
  /** Content displayed inside the safe area. */
  children: ReactNode;
  /** Extra classes for the outer container. */
  className?: string;
  /**
   * Includes the bottom gesture area in the container padding.
   *
   * @defaultValue `false`
   */
  bottomInset?: boolean;
}

/**
 * Keeps route content below the status bar and optionally above the gesture area.
 *
 * @example
 * ```tsx
 * <ScreenContainer><TopBar title="Routine" /></ScreenContainer>
 * ```
 */
export function ScreenContainer({
  children,
  className,
  bottomInset = false,
}: ScreenContainerProps) {
  const insets = useSafeAreaInsets();
  const paddingBottom = bottomInset ? insets.bottom : 0;

  return (
    <View
      className={cn('flex-1 bg-surface-background', className)}
      style={{ paddingTop: insets.top, paddingBottom }}
    >
      {children}
    </View>
  );
}
