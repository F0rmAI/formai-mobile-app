import { View, type ViewProps } from 'react-native';
import type { IconName, ToastTone } from '@/types/ui';
import { cn } from '@/utils/cn';
import { Icon } from './Icon';
import { Text } from './Text';

const toneStyles: Record<ToastTone, { icon: IconName; color: string }> = {
  info: { icon: 'info', color: 'text-primary-container' },
  success: { icon: 'check_circle', color: 'text-tertiary-container' },
  error: { icon: 'error', color: 'text-error-container' },
};

export interface ToastProps extends Omit<ViewProps, 'children'> {
  message: string;
  tone?: ToastTone;
  className?: string;
}

/** Mensaje breve sobre superficie inversa. */
export function Toast({
  message,
  tone = 'info',
  className,
  ...props
}: ToastProps) {
  const styles = toneStyles[tone];

  return (
    <View
      accessibilityRole={tone === 'error' ? 'alert' : 'text'}
      accessibilityLiveRegion="polite"
      className={cn(
        'w-full flex-row items-center gap-lg rounded-md bg-surface-inverse px-xl py-3 shadow-floating',
        className,
      )}
      {...props}
    >
      <Icon name={styles.icon} size={20} className={styles.color} />
      <Text variant="body-l-strong" tone="on-inverse" className="flex-1">
        {message}
      </Text>
    </View>
  );
}
