import { useState } from 'react';
import { Image, View, type ImageSourcePropType } from 'react-native';
import type { AvatarSize } from '@/types/ui';
import { cn } from '@/utils/cn';
import { Text } from './Text';

const sizeClass: Record<AvatarSize, string> = {
  sm: 'size-8',
  md: 'size-12 border-2 border-surface-card shadow-raised',
};

function initialsOf(name: string) {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0]?.toUpperCase())
    .join('');
}

export interface AvatarProps {
  /** Nombre de la persona: se usa como texto accesible y para las iniciales. */
  name: string;
  src?: string | ImageSourcePropType;
  size?: AvatarSize;
  className?: string;
}

/** Foto de perfil circular. `sm` 32 px (header) o `md` 48 px (saludo). */
export function Avatar({ name, src, size = 'sm', className }: AvatarProps) {
  const [failedSrc, setFailedSrc] = useState<string>();
  const remoteSrc = typeof src === 'string' ? src : undefined;
  const showImage =
    Boolean(src) && (typeof src !== 'string' || remoteSrc !== failedSrc);

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
          source={typeof src === 'string' ? { uri: src } : src}
          className="size-full"
          resizeMode="cover"
          onError={() => remoteSrc && setFailedSrc(remoteSrc)}
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
