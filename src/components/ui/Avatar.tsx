/**
 * Avatar primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { useState } from 'react';
import { Image, View } from 'react-native';
import type { AvatarSize } from '@/types/ui';
import { cn } from '@/utils/cn';
import { Text } from './Text';

const sizeClass: Record<AvatarSize, string> = {
  sm: 'size-8',
  md: 'size-12 border-2 border-surface-card shadow-raised',
};

/** Returns up to two uppercase initials of a name. */
function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('');
}

/**
 * Props accepted by {@link Avatar}.
 */
export interface AvatarProps {
  /** Name of the person, used as accessible text and for the initials. */
  name: string;
  /** URL of the picture; initials are shown when it is missing or fails to load. */
  src?: string;
  /**
   * Diameter preset.
   *
   * @defaultValue `'sm'`
   */
  size?: AvatarSize;
  /** Extra classes for layout adjustments from the parent. */
  className?: string;
}

/**
 * Renders a circular profile picture with an initials fallback.
 *
 * @example
 * ```tsx
 * <Avatar name="Jane Doe" src={user.avatarUrl} />
 * ```
 */
export function Avatar({ name, src, size = 'sm', className }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const showImage = Boolean(src) && src !== failedSrc;

  return (
    <View
      accessibilityRole="image"
      accessibilityLabel={name}
      className={cn(
        'items-center justify-center overflow-hidden rounded-full bg-primary-container',
        sizeClass[size],
        className,
      )}
    >
      {showImage ? (
        <Image
          source={{ uri: src }}
          className="size-full"
          resizeMode="cover"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        <Text
          variant={size === 'sm' ? 'label-m-bold' : 'label-l'}
          tone="primary"
        >
          {initialsOf(name)}
        </Text>
      )}
    </View>
  );
}
