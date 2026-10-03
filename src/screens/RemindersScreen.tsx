/**
 * Local workout reminder settings (wireflow 4.1 / 4.2).
 *
 * @author Christian
 * @packageDocumentation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useMemo, useState } from 'react';
import { Platform, ScrollView, View } from 'react-native';
import {
  ReminderPreviewModal,
  ReminderSettingsCard,
} from '@/components/reminders';
import { ScreenContainer, TopBar } from '@/components/layout';
import { Button, Text, Toast } from '@/components/ui';
import { useReminders } from '@/hooks/useReminders';
import type { RootStackParamList } from '@/types/navigation';

/** Lets the client enable reminders, pick a time and preview the notice. */
export function RemindersScreen({
  navigation,
}: NativeStackScreenProps<RootStackParamList, 'Reminders'>) {
  const {
    enabled,
    hour,
    minute,
    timeLabel,
    previewContent,
    isSaving,
    error,
    setEnabled,
    setTime,
  } = useReminders();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [showPicker, setShowPicker] = useState(false);

  const pickerValue = useMemo(() => {
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return date;
  }, [hour, minute]);

  const previewClock = useMemo(() => {
    const date = new Date();
    date.setHours(hour, minute, 0, 0);
    return date;
  }, [hour, minute]);

  return (
    <ScreenContainer>
      <TopBar title="Recordatorios" onBack={navigation.goBack} />
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-xl px-xl pb-2xl pt-xl"
        keyboardShouldPersistTaps="handled"
      >
        <Text variant="body-l" tone="secondary">
          Te avisaremos cuando tengas una sesión programada pendiente. Si ya la
          completaste, no recibirás el aviso.
        </Text>
        {error && <Toast message={error} tone="error" />}
        <ReminderSettingsCard
          enabled={enabled}
          timeLabel={timeLabel}
          disabled={isSaving}
          onEnabledChange={(value) => {
            setEnabled(value).catch(() => undefined);
          }}
          onPressTime={() => setShowPicker(true)}
        />
        {enabled && (
          <Button
            label="Ver ejemplo de aviso"
            icon="notifications_active"
            variant="ghost"
            fullWidth
            onPress={() => setPreviewOpen(true)}
          />
        )}
        {showPicker && <ReminderTimePicker value={pickerValue} onChange={setTime} onClose={() => setShowPicker(false)} />}
      </ScrollView>
      <ReminderPreviewModal
        open={previewOpen}
        content={previewContent}
        clock={previewClock}
        onClose={() => setPreviewOpen(false)}
      />
    </ScreenContainer>
  );
}

/**
 * Loads the native time picker only when opened so the screen module can mount
 * even before the native binary includes the datetimepicker package.
 */
function ReminderTimePicker({
  value,
  onChange,
  onClose,
}: {
  value: Date;
  onChange: (hour: number, minute: number) => Promise<void>;
  onClose: () => void;
}) {
  const DateTimePicker = require('@react-native-community/datetimepicker')
    .default as typeof import('@react-native-community/datetimepicker').default;

  return (
    <View>
      <DateTimePicker
        value={value}
        mode="time"
        display={Platform.OS === 'ios' ? 'spinner' : 'default'}
        onChange={(event, date) => {
          if (Platform.OS === 'android') {
            onClose();
          }
          if (event.type === 'dismissed' || !date) {
            return;
          }
          onChange(date.getHours(), date.getMinutes()).catch(() => undefined);
          if (Platform.OS === 'ios') {
            onClose();
          }
        }}
      />
    </View>
  );
}
