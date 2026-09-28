import { Modal, Pressable, View } from 'react-native';
import type { DialogTone, IconName } from '@/types/ui';
import { cn } from '@/utils/cn';
import { Button } from './Button';
import { Icon } from './Icon';
import { Text } from './Text';

export interface DialogProps {
  open: boolean;
  title: string;
  description?: string;
  tone?: DialogTone;
  icon?: IconName;
  confirmLabel: string;
  cancelLabel?: string;
  onConfirm: () => void;
  /** Se llama al cancelar, al tocar fuera o con el botón atrás de Android. */
  onCancel: () => void;
}

/** Diálogo de confirmación (345 px en mobile). */
export function Dialog({
  open,
  title,
  description,
  tone = 'default',
  icon = tone === 'danger' ? 'warning' : 'flag',
  confirmLabel,
  cancelLabel = 'Cancelar',
  onConfirm,
  onCancel,
}: DialogProps) {
  const isDanger = tone === 'danger';

  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onCancel}
    >
      <Pressable
        accessibilityLabel={cancelLabel}
        onPress={onCancel}
        className="flex-1 items-center justify-center bg-surface-inverse/40 p-xl"
      >
        <Pressable
          accessibilityViewIsModal
          onPress={() => {}}
          className="w-full max-w-[345px] items-start gap-xl rounded-lg bg-surface-card p-2xl shadow-floating"
        >
          <View
            className={cn(
              'size-11 items-center justify-center rounded-md',
              isDanger ? 'bg-error-container' : 'bg-primary-container',
            )}
          >
            <Icon
              name={icon}
              size={24}
              className={isDanger ? 'text-error' : 'text-primary'}
            />
          </View>
          <Text variant="title" accessibilityRole="header">
            {title}
          </Text>
          {description && (
            <Text variant="body-l" tone="secondary">
              {description}
            </Text>
          )}
          <View className="w-full flex-row gap-md">
            <Button
              label={cancelLabel}
              variant="secondary"
              size="md"
              className="flex-1"
              onPress={onCancel}
            />
            <Button
              label={confirmLabel}
              variant={isDanger ? 'danger' : 'primary'}
              size="md"
              className="flex-1"
              onPress={onConfirm}
            />
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}
