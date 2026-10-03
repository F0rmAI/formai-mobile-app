/**
 * Client welcome and entry screen.
 *
 * @author Carlos
 * @packageDocumentation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { ScrollView, View } from 'react-native';
import { ScreenContainer } from '@/components/layout';
import { BrandLogo, Button, Text } from '@/components/ui';
import type { RootStackParamList } from '@/types/navigation';

type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

/** Shows sign-in and activation entry points for signed-out clients. */
export function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  return (
    <ScreenContainer bottomInset>
      <ScrollView
        contentContainerClassName="grow justify-between gap-2xl px-xl pb-2xl pt-2xl"
        alwaysBounceVertical={false}
      >
        <View className="items-center gap-xl">
          <BrandLogo large />
          <Text variant="display-xl" accessibilityRole="header">
            FormAI
          </Text>
          <Text variant="body-l" tone="secondary" className="text-center">
            Tu rutina, tu progreso y la técnica correcta en cada máquina.
          </Text>
        </View>

        <View className="gap-md">
          <Button
            label="Iniciar sesión"
            fullWidth
            onPress={() => navigation.navigate('SignIn')}
          />
          <Button
            label="Activar mi cuenta"
            icon="key"
            variant="secondary"
            fullWidth
            onPress={() => navigation.navigate('ActivationCode')}
          />
          <Text variant="body-m" tone="muted" className="text-center">
            ¿Eres entrenador? Ingresa desde la web de FormAI.
          </Text>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}
