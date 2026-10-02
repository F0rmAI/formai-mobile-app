/**
 * Password reset request screen.
 *
 * @author Carlos
 * @packageDocumentation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback } from 'react';
import { ScrollView, View } from 'react-native';
import { ScreenContainer, TopBar } from '@/components/layout';
import { Button, Text, TextField } from '@/components/ui';
import { useForgotPassword } from '@/hooks/useForgotPassword';
import type { RootStackParamList } from '@/types/navigation';

type ForgotPasswordScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ForgotPassword'
>;

/** Shows email entry using useForgotPassword to request a reset link. */
export function ForgotPasswordScreen({
  navigation,
  route,
}: ForgotPasswordScreenProps) {
  const renewal = route.params?.renewal;
  const goToSent = useCallback(
    (sentEmail: string) =>
      navigation.navigate('PasswordResetSent', { email: sentEmail, renewal }),
    [navigation, renewal],
  );
  const { email, error, isSubmitting, changeEmail, submit } = useForgotPassword(
    route.params?.email ?? '',
    goToSent,
  );

  return (
    <ScreenContainer>
      <TopBar title="Recuperar contraseña" onBack={navigation.goBack} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-xl px-xl pb-8 pt-xl"
      >
        <View className="gap-xs">
          <Text variant="headline" accessibilityRole="header">
            Recupera tu acceso
          </Text>
          <Text variant="body-l" tone="secondary">
            Escribe tu correo y te enviaremos un enlace para crear una nueva
            contraseña.
          </Text>
        </View>

        <TextField
          label="Correo electrónico"
          leadingIcon="mail"
          value={email}
          error={error}
          editable={!isSubmitting}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="username"
          returnKeyType="send"
          onChangeText={changeEmail}
          onSubmitEditing={submit}
        />

        <Button
          label="Enviar enlace"
          fullWidth
          loading={isSubmitting}
          onPress={submit}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
