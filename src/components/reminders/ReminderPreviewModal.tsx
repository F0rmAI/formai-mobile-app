/**
 * In-app mock of the pending-session lock-screen notice (wireflow 4.3).
 *
 * @author Christian
 * @packageDocumentation
 */

import { Modal, Pressable, View } from 'react-native';
import { BrandLogo, Text } from '@/components/ui';
import type { ReminderPreviewContent } from '@/types/reminders';
import { formatLongDate } from '@/utils/dates';
import { formatClockShort } from '@/utils/reminders';

/**
 * Props accepted by {@link ReminderPreviewModal}.
 */
export interface ReminderPreviewModalProps {
  /** Whether the preview is visible. */
  open: boolean;
  /** Notification title and body. */
  content: ReminderPreviewContent;
  /** Local clock used for the mock lock screen. */
  clock?: Date;
  /** Closes the preview. */
  onClose: () => void;
}

/**
 * Renders a dark full-screen preview of a FormAI reminder notification.
 */
export function ReminderPreviewModal({
  open,
  content,
  clock = new Date(),
  onClose,
}: ReminderPreviewModalProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Cerrar ejemplo de aviso"
        onPress={onClose}
        className="flex-1 justify-center bg-surface-inverse px-xl"
      >
        <View className="mb-2xl items-center gap-xs" pointerEvents="none">
          <Text variant="body-l-strong" tone="on-inverse" className="text-center">
            {formatLongDate(clock)}
          </Text>
          <Text variant="display-xl" tone="on-inverse" className="text-center">
            {formatClockShort(clock.getHours(), clock.getMinutes())}
          </Text>
        </View>
        <View className="flex-row items-center gap-md rounded-lg bg-surface-card p-xl shadow-floating">
          <BrandLogo />
          <View className="flex-1 gap-2xs">
            <Text variant="body-m" tone="muted">
              FormAI · ahora
            </Text>
            <Text variant="body-l-strong" numberOfLines={2}>
              {content.title}
            </Text>
            <Text variant="body-m" tone="secondary" numberOfLines={2}>
              {content.body}
            </Text>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}
