import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Text } from '@/components/ui';
import { useCounter } from '@/hooks/useCounter';

/**
 * Pantalla inicial de la base del proyecto: verifica que Uniwind (Tailwind), los tokens,
 * la tipografía, los íconos y los componentes del design system funcionan.
 *
 * Nota: SafeAreaView no es un componente del core de React Native, así que Uniwind no le
 * agrega `className`; los estilos van en los `View` que lo envuelven.
 */
export function HomeScreen() {
  const { count, increment } = useCounter();

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
