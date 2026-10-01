/**
 * Brand logo primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Image, type ImageProps } from 'react-native';
import { cn } from '@/utils/cn';

const brandLogo = require('@/assets/brand-logo.png');

/**
 * Props accepted by {@link BrandLogo}.
 */
export interface BrandLogoProps extends Omit<ImageProps, 'source'> {
  /** Extra classes for layout adjustments from the parent. */
  className?: string;
}

/**
 * Renders the product logo mark at 32 px.
 *
 * @example
 * ```tsx
 * <BrandLogo />
 * ```
 */
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
