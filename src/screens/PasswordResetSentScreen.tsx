import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/layout';
import { Button, EmptyState, Text, Toast } from '@/components/ui';
import { useMailApp } from '@/hooks/useMailApp';
import type { RootStackParamList } from '@/types/navigation';

type PasswordResetSentScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PasswordResetSent'
>;

/** Recuperación de contraseña: confirma el envío del enlace sin revelar si el correo existe. */
export function PasswordResetSentScreen({
  navigation,
  route,
}: PasswordResetSentScreenProps) {
  const insets = useSafeAreaInsets();
  const { error, openMailApp } = useMailApp(route.params.email);

  return (
    <View
      className="flex-1 bg-surface-background"
      style={{ paddingTop: insets.top }}
    >
      <TopBar title="Recuperar contraseña" onBack={navigation.goBack} />
      <View className="flex-1 justify-center gap-xl px-xl pb-8">
        <EmptyState
          icon="mark_email_read"
          title="Revisa tu correo"
          description="Si el correo está registrado, recibirás un enlace para crear una nueva contraseña. El enlace vence en 30 minutos y solo puede usarse una vez."
          action={{
            label: 'Abrir enlace del correo',
            icon: 'open_in_new',
            onPress: openMailApp,
          }}
        />
        {error && (
          <Text
            variant="body-m"
            tone="error"
            accessibilityRole="alert"
            className="text-center"
          >
            {error}
          </Text>
        )}
        <Button
          label="Volver a iniciar sesión"
          variant="ghost"
          size="md"
          fullWidth
          onPress={() => navigation.popTo('SignIn')}
        />
      </View>
      {route.params.renewal && (
        <View
          className="absolute inset-x-xl"
          style={{ bottom: insets.bottom + 16 }}
        >
          <Toast message="Te enviamos un nuevo enlace" tone="success" />
        </View>
      )}
    </View>
  );
}
