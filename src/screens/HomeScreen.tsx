/**
 * Starter screen of the project base.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from '@/components/ui';
import { useCounter } from '@/hooks/useCounter';

/**
 * Shows the product name and a counter, using {@link useCounter} for the state.
 *
 * @remarks
 * Exists to verify that styles, tokens, fonts, icons and components work. Replace it when the
 * first feature lands.
 */
export function HomeScreen() {
  const { count, increment } = useCounter();

  // SafeAreaView is not a React Native core component, so it does not receive `className`:
  // the utilities go on the core views around it.
  return (
    <View className="flex-1 bg-surface-background">
      <SafeAreaView style={styles.safeArea}>
        <View className="flex-1 items-center justify-center gap-2xl p-xl">
          <Text variant="display-xl" tone="primary" accessibilityRole="header">
            FormAI
          </Text>
          <View className="items-center gap-xl">
            <Text
              variant="display"
              testID="counter-value"
              accessibilityLiveRegion="polite"
            >
              {count}
            </Text>
            <Button
              label="Incrementar"
              icon="add"
              className="self-center"
              onPress={increment}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
});
