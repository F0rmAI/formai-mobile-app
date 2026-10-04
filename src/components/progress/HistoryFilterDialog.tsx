/**
 * Date-range filter dialog for workout history.
 *
 * @author Christian
 * @packageDocumentation
 */

import { Modal, Pressable, View } from 'react-native';
import { Button, Text, TextField } from '@/components/ui';

/**
 * Props accepted by {@link HistoryFilterDialog}.
 */
export interface HistoryFilterDialogProps {
  /** Whether the dialog is visible. */
  open: boolean;
  /** Draft start date in `dd/mm/yyyy`. */
  from: string;
  /** Draft end date in `dd/mm/yyyy`. */
  to: string;
  /** Updates the draft start date. */
  onChangeFrom: (value: string) => void;
  /** Updates the draft end date. */
  onChangeTo: (value: string) => void;
  /** Applies the draft range. */
  onApply: () => void;
  /** Validation error shown below the fields. */
  error?: string;
  /** Closes without applying. */
  onCancel: () => void;
}

/**
 * Collects an inclusive date range for the historial screen.
 *
 * @example
 * ```tsx
 * <HistoryFilterDialog open={open} from={from} to={to} onChangeFrom={setFrom} onChangeTo={setTo} onApply={apply} onCancel={close} />
 * ```
 */
export function HistoryFilterDialog({
  open,
  from,
  to,
  onChangeFrom,
  onChangeTo,
  onApply,
  error,
  onCancel,
}: HistoryFilterDialogProps) {
  return (
    <Modal
      visible={open}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View className="flex-1 justify-center bg-surface-inverse/40 px-xl">
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Cancelar"
          className="absolute inset-0"
          onPress={onCancel}
        />
        <View
          accessibilityViewIsModal
          className="gap-xl rounded-lg bg-surface-card p-xl shadow-raised"
        >
          <View className="gap-xs">
            <Text variant="headline" accessibilityRole="header">
              Filtrar historial
            </Text>
            <Text variant="body-m" tone="secondary">
              Muestra solo los entrenamientos de un rango de fechas.
            </Text>
          </View>
          <View className="gap-md">
            <TextField
              label="Desde"
              leadingIcon="calendar_month"
              placeholder="dd/mm/aaaa"
              value={from}
              onChangeText={onChangeFrom}
              autoCapitalize="none"
            />
            <TextField
              label="Hasta"
              leadingIcon="calendar_month"
              placeholder="dd/mm/aaaa"
              value={to}
              onChangeText={onChangeTo}
              autoCapitalize="none"
            />
          </View>
          {error && (
            <Text variant="body-m" tone="error" accessibilityRole="alert">
              {error}
            </Text>
          )}
          <View className="gap-md">
            <Button
              label="Aplicar filtro"
              icon="filter_alt"
              fullWidth
              onPress={onApply}
            />
            <Button
              label="Cancelar"
              variant="ghost"
              fullWidth
              onPress={onCancel}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
}
