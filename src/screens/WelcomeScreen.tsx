import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Image, ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BrandLogo, Button, Text } from '@/components/ui';
import type { RootStackParamList } from '@/types/navigation';

const welcomeHero = require('@/assets/welcome-hero.jpeg');

type WelcomeScreenProps = NativeStackScreenProps<RootStackParamList, 'Welcome'>;

/** Bienvenida con las opciones de ingreso a la app. */
export function WelcomeScreen({ navigation }: WelcomeScreenProps) {
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-surface-background"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <ScrollView
        contentContainerClassName="grow justify-center gap-2xl px-xl pb-8 pt-12"
        alwaysBounceVertical={false}
      >
        <View className="items-center gap-xl">
          <BrandLogo className="size-[72px]" />
          <Text variant="display-xl" accessibilityRole="header">
            FormAI
          </Text>
          <Text variant="body-l" tone="secondary" className="text-center">
            Tu rutina, tu progreso y la técnica correcta en cada máquina.
          </Text>
        </View>

        <View className="rounded-md shadow-card">
          <Image
            source={welcomeHero}
            accessibilityIgnoresInvertColors
            resizeMode="cover"
            className="h-[260px] w-full rounded-md"
          />
        </View>

        <View className="gap-md">
          <Button
            label="Iniciar sesión"
            fullWidth
            onPress={() => navigation.navigate('SignIn')}
          />
          {/* La activación de cuenta se conecta con FE-MOB-003. */}
          <Button
            label="Activar mi cuenta"
            icon="key"
            variant="secondary"
            fullWidth
          />
          <Text variant="body-m" tone="muted" className="text-center">
            ¿Eres entrenador? Ingresa desde la web de FormAI.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
