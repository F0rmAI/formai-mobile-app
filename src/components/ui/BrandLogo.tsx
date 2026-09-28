import { Image, type ImageProps } from 'react-native';
import { cn } from '@/utils/cn';

const brandLogo = require('@/assets/brand-logo.png');

export interface BrandLogoProps extends Omit<ImageProps, 'source'> {
  className?: string;
}

/** Isotipo de FormAI (32 px). */
export function BrandLogo({
  className,
  accessibilityLabel = 'FormAI',
  ...props
}: BrandLogoProps) {
  return (
    <Image
      source={brandLogo}
      accessibilityLabel={accessibilityLabel}
      resizeMode="cover"
      className={cn('size-8 rounded-sm', className)}
      {...props}
    />
  );
}
