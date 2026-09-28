import { Text as RNText, type TextProps as RNTextProps } from 'react-native';
import type { TextTone, TextVariant } from '@/types/ui';
import { cn } from '@/utils/cn';

/**
 * Tamaño/interlineado/tracking salen de tokens.css. En React Native cada peso es
 * una familia distinta (font-sans-*), por eso el peso se fija aquí.
 */
const textVariantClass: Record<TextVariant, string> = {
  'display-xl': 'text-display-xl font-sans-extrabold',
  display: 'text-display font-sans-extrabold',
  headline: 'text-headline font-sans-bold',
  title: 'text-title font-sans-semibold',
  'title-strong': 'text-title-strong font-sans-extrabold',
  'label-l': 'text-label-l font-sans-bold',
  'body-l-strong': 'text-body-l-strong font-sans-semibold',
  'body-l': 'text-body-l font-sans',
  'label-m': 'text-label-m font-sans-semibold',
  'label-m-bold': 'text-label-m-bold font-sans-bold',
  'body-m': 'text-body-m font-sans',
  overline: 'text-overline font-sans-bold uppercase',
  caption: 'text-caption font-sans',
};

const textToneClass: Record<TextTone, string> = {
  default: 'text-content-primary',
  secondary: 'text-content-secondary',
  muted: 'text-content-muted',
  subtle: 'text-content-subtle',
  'on-primary': 'text-content-on-primary',
  'on-inverse': 'text-content-on-inverse',
  primary: 'text-primary',
  'primary-bright': 'text-primary-bright',
  accent: 'text-secondary-text',
  tertiary: 'text-tertiary',
  error: 'text-error',
};

export interface TextProps extends RNTextProps {
  variant?: TextVariant;
  tone?: TextTone;
  className?: string;
}

export function Text({
  variant = 'body-l',
  tone = 'default',
  className,
  ...props
}: TextProps) {
  return (
    <RNText
      className={cn(textVariantClass[variant], textToneClass[tone], className)}
      {...props}
    />
  );
}
