/**
 * Client sign-in screen.
 *
 * @author Carlos
 * @packageDocumentation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { InsetToast, ScreenContainer, TopBar } from '@/components/layout';
import { Button, Text, TextField, Toast } from '@/components/ui';
import { useSignIn } from '@/hooks/useSignIn';
import type { RootStackParamList } from '@/types/navigation';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

/** Shows client credentials using useSignIn for validation and submission. */
export function SignInScreen({ navigation, route }: SignInScreenProps) {
  const { activatedEmail, passwordUpdated, sessionNotPersisted } =
    route.params ?? {};
  const toast = activatedEmail
    ? 'Cuenta activada'
    : passwordUpdated
    ? 'Contraseña actualizada'
    : undefined;
  const [showPassword, setShowPassword] = useState(false);
  const {
    email,
    password,
    errors,
    sessionMessage,
    isSubmitting,
    changeEmail,
    changePassword,
    submit,
  } = useSignIn(activatedEmail ?? route.params?.email, sessionNotPersisted);

  return (
    <ScreenContainer>
      <TopBar title="Iniciar sesión" onBack={navigation.goBack} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-xl px-xl pb-8 pt-xl"
      >
        <View className="gap-xs">
          <Text variant="headline" accessibilityRole="header">
            Hola de nuevo
          </Text>
          <Text variant="body-l" tone="secondary">
            {passwordUpdated
              ? 'Ingresa con tu nueva contraseña.'
              : 'Ingresa con el correo que registró tu entrenador.'}
          </Text>
        </View>

        {sessionMessage && <Toast message={sessionMessage} tone="error" />}

        <TextField
          label="Correo electrónico"
          leadingIcon="mail"
          value={email}
          error={errors.email}
          editable={!isSubmitting}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="email"
          textContentType="username"
          returnKeyType="next"
          onChangeText={changeEmail}
        />
        <TextField
          label="Contraseña"
          leadingIcon="lock"
          trailingIcon={showPassword ? 'visibility_off' : 'visibility'}
          trailingIconLabel={
            showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'
          }
          onTrailingIconPress={() => setShowPassword(visible => !visible)}
          value={password}
          error={errors.password}
          editable={!isSubmitting}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="current-password"
          textContentType="password"
          returnKeyType="go"
          onChangeText={changePassword}
          onSubmitEditing={submit}
        />

        <Button
          label="¿Olvidaste tu contraseña?"
          variant="ghost"
          size="sm"
          disabled={isSubmitting}
          onPress={() =>
            navigation.navigate('ForgotPassword', { email: email.trim() })
          }
        />
        <Button
          label="Iniciar sesión"
          fullWidth
          loading={isSubmitting}
          onPress={submit}
        />
      </ScrollView>
      {toast && <InsetToast message={toast} />}
    </ScreenContainer>
  );
}
