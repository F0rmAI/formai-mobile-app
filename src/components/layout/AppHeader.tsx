/**
 * App header layout component.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { View, type ImageSourcePropType } from 'react-native';
import { Avatar, BrandLogo, Text } from '@/components/ui';
import { cn } from '@/utils/cn';

/**
 * Props accepted by {@link AppHeader}.
 */
export interface AppHeaderProps {
  /** Text shown below the brand name. */
  subtitle?: string;
  /** Signed-in user whose avatar is shown; `avatarSource` is a bundled image used instead of the URL. */
  user?: {
    name: string;
    avatarUrl?: string;
    avatarSource?: ImageSourcePropType;
  };
  /** Extra classes for layout adjustments from the parent. */
  className?: string;
}

/**
 * Renders the main header with the brand and the user avatar.
 *
 * @example
 * ```tsx
 * <AppHeader subtitle="Today" user={user} />
 * ```
 */
export function AppHeader({ subtitle, user, className }: AppHeaderProps) {
  return (
    <View
      className={cn(
        'h-16 w-full flex-row items-center justify-between bg-surface-background px-xl',
        className,
      )}
    >
      <View className="flex-row items-center gap-md">
        <BrandLogo />
        <View>
          <Text variant="label-l">FormAI</Text>
          {subtitle && (
            <Text variant="caption" tone="secondary">
              {subtitle}
            </Text>
          )}
        </View>
      </View>
      {user && (
        <Avatar name={user.name} src={user.avatarSource ?? user.avatarUrl} />
      )}
    </View>
  );
}
