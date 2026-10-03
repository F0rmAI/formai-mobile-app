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
  /** Draft start date in `yyyy-MM-dd`. */
  from: string;
  /** Draft end date in `yyyy-MM-dd`. */
  to: string;
  /** Updates the draft start date. */
  onChangeFrom: (value: string) => void;
  /** Updates the draft end date. */
  onChangeTo: (value: string) => void;
  /** Applies the draft range. */
  onApply: () => void;
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
              Elige el rango de fechas de tus entrenamientos.
            </Text>
          </View>
          <View className="gap-md">
            <TextField
              label="Desde"
              helper="aaaa-mm-dd"
              placeholder="aaaa-mm-dd"
              value={from}
              onChangeText={onChangeFrom}
              autoCapitalize="none"
            />
            <TextField
              label="Hasta"
              helper="aaaa-mm-dd"
              placeholder="aaaa-mm-dd"
              value={to}
              onChangeText={onChangeTo}
              autoCapitalize="none"
            />
          </View>
          <View className="flex-row gap-md">
            <Button
              label="Cancelar"
              variant="secondary"
              className="flex-1"
              onPress={onCancel}
            />
            <Button label="Aplicar" className="flex-1" onPress={onApply} />
          </View>
        </View>
      </View>
    </Modal>
  );
}
