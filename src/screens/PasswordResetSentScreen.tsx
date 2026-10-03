/**
 * Password reset request confirmation screen.
 *
 * @author Carlos
 * @packageDocumentation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { InsetToast, ScreenContainer, TopBar } from '@/components/layout';
import { Button, EmptyState, Text } from '@/components/ui';
import { useMailApp } from '@/hooks/useMailApp';
import type { RootStackParamList } from '@/types/navigation';

type PasswordResetSentScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'PasswordResetSent'
>;

/** Confirms the reset request and uses useMailApp to open the inbox. */
export function PasswordResetSentScreen({
  navigation,
  route,
}: PasswordResetSentScreenProps) {
  const { error, openMailApp } = useMailApp(route.params.email);

  return (
    <ScreenContainer>
      <TopBar title="Recuperar contraseña" onBack={navigation.goBack} />
      <View className="flex-1 justify-center gap-xl px-xl pb-8">
        <EmptyState
          icon="mark_email_read"
          title="Revisa tu correo"
          description="Si el correo está registrado, recibirás un enlace para crear una nueva contraseña."
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
        <InsetToast message="Te enviamos un nuevo enlace" />
      )}
    </ScreenContainer>
  );
}
