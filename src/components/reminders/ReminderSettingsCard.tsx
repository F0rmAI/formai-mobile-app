/**
 * Toggle and time field for local workout reminders.
 *
 * @author Christian
 * @packageDocumentation
 */

import { Pressable, View } from 'react-native';
import { Card, Icon, Text, Toggle } from '@/components/ui';

/**
 * Props accepted by {@link ReminderSettingsCard}.
 */
export interface ReminderSettingsCardProps {
  /** Whether reminders are enabled. */
  enabled: boolean;
  /** Localized time label shown in the field. */
  timeLabel: string;
  /** Called when the toggle changes. */
  onEnabledChange: (enabled: boolean) => void;
  /** Called when the user activates the time field. */
  onPressTime: () => void;
  /**
   * Disables interactions while saving.
   *
   * @defaultValue `false`
   */
  disabled?: boolean;
}

/**
 * Renders the settings card from wireflow 4.1 / 4.2.
 */
export function ReminderSettingsCard({
  enabled,
  timeLabel,
  onEnabledChange,
  onPressTime,
  disabled = false,
}: ReminderSettingsCardProps) {
  return (
    <Card className="gap-md">
      <View className="flex-row items-center gap-md">
        <View className="flex-1 gap-2xs">
          <Text variant="body-l-strong">Recordarme mis sesiones</Text>
          <Text variant="body-m" tone="secondary">
            {enabled ? 'Activados' : 'Desactivados'}
          </Text>
        </View>
        <Toggle
          label="Recordarme mis sesiones"
          checked={enabled}
          onChange={onEnabledChange}
          disabled={disabled}
        />
      </View>
      {enabled && (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Hora del aviso"
          disabled={disabled}
          onPress={onPressTime}
          className="gap-sm"
        >
          <Text variant="label-m" tone="secondary">
            Hora del aviso
          </Text>
          <View className="h-12 flex-row items-center gap-md rounded-md border border-line-outline bg-surface-card px-xl">
            <Icon name="schedule" size={20} className="text-content-muted" />
            <Text variant="body-l" className="flex-1">
              {timeLabel}
            </Text>
            <Icon name="expand_more" size={20} className="text-content-muted" />
          </View>
        </Pressable>
      )}
    </Card>
  );
}
