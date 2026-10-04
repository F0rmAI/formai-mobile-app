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
  /**
   * Uses the large mark on the welcome screen.
   *
   * @defaultValue `false`
   */
  large?: boolean;
  /**
   * Accessible name of the logo.
   *
   * @defaultValue `'FormAI'`
   */
  accessibilityLabel?: string;
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
  large = false,
  accessibilityLabel = 'FormAI',
  ...props
}: BrandLogoProps) {
  return (
    <Image
      source={brandLogo}
      accessibilityLabel={accessibilityLabel}
      resizeMode="cover"
      className={cn(
        large ? 'size-[72px] rounded-sm' : 'size-8 rounded-sm',
        className,
      )}
      {...props}
    />
  );
}
