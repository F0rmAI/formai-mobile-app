/**
 * Toast placement above the bottom gesture area.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Toast } from '@/components/ui';

/**
 * Props accepted by {@link InsetToast}.
 */
export interface InsetToastProps {
  /** Message shown by the toast. */
  message: string;
  /** Positions the toast above the main tab bar. */
  aboveTabs?: boolean;
}

/**
 * Positions a success toast above the gesture area.
 *
 * @example
 * ```tsx
 * <InsetToast message="Saved" />
 * ```
 */
export function InsetToast({ message, aboveTabs = false }: InsetToastProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="absolute inset-x-xl"
      style={{ bottom: insets.bottom + (aboveTabs ? 88 : 16) }}
    >
      <Toast message={message} tone="success" />
    </View>
  );
}
