/**
 * Dialog primitive of the design system.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { Modal, Pressable, View } from 'react-native';
import type { DialogTone, IconName } from '@/types/ui';
import { cn } from '@/utils/cn';
import { Button } from './Button';
import { Icon } from './Icon';
import { Text } from './Text';

/**
 * Props accepted by {@link Dialog}.
 */
export interface DialogProps {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Question or statement the user must confirm. */
  title: string;
  /** Supporting text shown below the title. */
  description?: string;
  /**
   * Kind of confirmation.
   *
   * @defaultValue `'default'`
   */
  tone?: DialogTone;
  /** Icon shown in the tile; defaults to `flag`, or to `warning` for the `danger` tone. */
  icon?: IconName;
  /** Label of the confirm button. */
  confirmLabel: string;
  /**
   * Whether the confirm button shows a spinner and ignores presses.
   *
   * @defaultValue `false`
   */
  confirmLoading?: boolean;
  /** Icon shown to the left of the confirm button label. */
  confirmIcon?: IconName;
  /**
   * Label of the cancel button.
   *
   * @defaultValue `'Cancelar'`
   */
  cancelLabel?: string;
  /** Called when the user confirms. */
  onConfirm: () => void;
  /** Called when the user cancels or dismisses the dialog. */
  onCancel: () => void;
}

/**
 * Renders a modal confirmation dialog.
 *
 * @remarks
 * Use the `danger` tone for destructive actions.
 *
 * @example
 * ```tsx
 * <Dialog
 *   open={isOpen}
 *   title="Finish the session?"
 *   confirmLabel="Finish"
 *   onConfirm={finish}
 *   onCancel={close}
 * />
 * ```
 */
export function Dialog({
  open,
  title,
  description,
  tone = 'default',
  icon = tone === 'danger' ? 'warning' : 'flag',
  confirmLabel,
  confirmIcon,
  confirmLoading = false,
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
      <View
        accessible={false}
        accessibilityViewIsModal
        className="flex-1 items-center justify-center p-xl"
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={cancelLabel}
          onPress={onCancel}
          className="absolute inset-0 bg-surface-inverse/40"
        />
        <View
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
              className="flex-1 px-md"
              onPress={onCancel}
              disabled={confirmLoading}
            />
            <Button
              label={confirmLabel}
              icon={confirmIcon}
              variant={isDanger ? 'danger' : 'primary'}
              size="md"
              className="flex-1 px-md"
              onPress={onConfirm}
              loading={confirmLoading}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
