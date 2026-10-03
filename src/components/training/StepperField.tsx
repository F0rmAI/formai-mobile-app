/**
 * Numeric set field for recording training measurements.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { TextInput, View } from 'react-native';
import { IconButton, Text } from '@/components/ui';
import { cn } from '@/utils/cn';

/** Props accepted by the numeric stepper field. */
export interface StepperFieldProps {
  /** Field label used by the input and controls. */
  label: string;
  /** Current numeric text. */
  value: string;
  /** Unit shown beside the value. */
  suffix: string;
  /** Amount changed by each step button. */
  step: number;
  /** Validation message shown below the field. */
  error?: string;
  /** Prescribed or previously recorded value shown below the controls. */
  hint?: string;
  /** Reports updated numeric text. */
  onChange: (value: string) => void;
}

/** Shows a numeric set field with increment and decrement controls. */
export function StepperField({
  label,
  value,
  suffix,
  step,
  error,
  hint,
  onChange,
}: StepperFieldProps) {
  const changeBy = (delta: number) => {
    const numericValue = Number(value.replace(',', '.')) || 0;
    onChange(String(Math.max(0, Math.round((numericValue + delta) * 10) / 10)));
  };

  return (
    <View
      className={cn(
        'min-w-0 flex-1 gap-sm rounded-md bg-surface-card px-md py-xl',
        error && 'border border-error',
      )}
    >
      <Text variant="overline" tone="secondary" className="text-center">
        {label}
      </Text>
      <View className="flex-row items-center gap-xs">
        <IconButton
          icon="remove"
          label={`Disminuir ${label.toLowerCase()}`}
          onPress={() => changeBy(-step)}
        />
        <View className="min-w-0 flex-1 flex-row items-baseline justify-center gap-2xs">
          <TextInput
            accessibilityLabel={label}
            keyboardType={step === 1 ? 'number-pad' : 'decimal-pad'}
            value={value}
            placeholder="—"
            placeholderTextColorClassName="accent-content-muted"
            maxLength={5}
            onChangeText={onChange}
            selectTextOnFocus
            className="w-10 p-0 text-right font-sans-extrabold text-headline text-content-primary"
          />
          <Text variant="caption" tone="secondary" numberOfLines={1}>
            {suffix}
          </Text>
        </View>
        <IconButton
          icon="add"
          label={`Aumentar ${label.toLowerCase()}`}
          onPress={() => changeBy(step)}
        />
      </View>
      {error && (
        <Text variant="caption" tone="error" accessibilityRole="alert">
          {error}
        </Text>
      )}
      {hint && (
        <Text variant="caption" tone="muted" className="text-center">
          {hint}
        </Text>
      )}
    </View>
  );
}
