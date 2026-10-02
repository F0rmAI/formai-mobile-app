/**
 * Welcome illustration with its intrinsic height.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Image } from 'react-native';

const welcomeHero = require('@/assets/welcome-hero.png');

/**
 * Renders the welcome illustration at its design height.
 *
 * @example
 * ```tsx
 * <WelcomeHero />
 * ```
 */
export function WelcomeHero() {
  return (
    <Image
      source={welcomeHero}
      accessibilityIgnoresInvertColors
      resizeMode="cover"
      className="h-[260px] w-full rounded-md"
    />
  );
}
