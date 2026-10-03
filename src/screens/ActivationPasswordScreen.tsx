/**
 * ActivationPasswordScreen module.
 *
 * @author Carlos
 * @packageDocumentation
 */

import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { ScreenContainer, TopBar } from '@/components/layout';
import {
  Button,
  Checkbox,
  Icon,
  Text,
  TextField,
  Toast,
} from '@/components/ui';
import { useAccountActivation } from '@/hooks/useAccountActivation';
import type { RootStackParamList } from '@/types/navigation';
import { DATA_CONSENT } from '@/utils/account-activation';

type ActivationPasswordScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ActivationPassword'
>;

/** Shows credentials and consent using useAccountActivation for submission. */
export function ActivationPasswordScreen({
  navigation,
  route,
}: ActivationPasswordScreenProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // If automatic sign-in fails after activation, continue to the sign-in screen.
  const onActivated = useCallback(
    (activatedEmail: string) =>
      navigation.reset({
        index: 1,
        routes: [
          { name: 'Welcome' },
          { name: 'SignIn', params: { activatedEmail } },
        ],
      }),
    [navigation],
  );
  const onCodeRejected = useCallback(
    () => navigation.popTo('ActivationCode', { codeRejected: true }),
    [navigation],
  );

  const {
    email,
    password,
    confirmPassword,
    consentAccepted,
    errors,
    isSubmitting,
    changeEmail,
    changePassword,
    changeConfirmPassword,
    changeConsent,
    submit,
  } = useAccountActivation(route.params.activationCode, {
    onActivated,
    onCodeRejected,
  });

  return (
    <ScreenContainer>
      <TopBar title="Activar cuenta" onBack={navigation.goBack} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        contentContainerClassName="gap-xl px-xl pb-8 pt-xl"
      >
        <View className="gap-xs">
          <Text variant="headline" accessibilityRole="header">
            Crea tu contraseña
          </Text>
          <Text variant="body-l" tone="secondary">
            Código verificado. Define la contraseña con la que ingresarás a
            FormAI.
          </Text>
        </View>

        <TextField
          label="Correo de tu cuenta"
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
          helper="Mínimo 8 caracteres, con letras y números."
          value={password}
          error={errors.password}
          editable={!isSubmitting}
          secureTextEntry={!showPassword}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="password"
          textContentType="password"
          returnKeyType="next"
          onChangeText={changePassword}
        />
        <TextField
          label="Confirmar contraseña"
          leadingIcon="lock"
          trailingIcon={showConfirmPassword ? 'visibility_off' : 'visibility'}
          trailingIconLabel={
            showConfirmPassword
              ? 'Ocultar confirmación de contraseña'
              : 'Mostrar confirmación de contraseña'
          }
          onTrailingIconPress={() =>
            setShowConfirmPassword(visible => !visible)
          }
          value={confirmPassword}
          error={errors.confirmPassword}
          editable={!isSubmitting}
          secureTextEntry={!showConfirmPassword}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="password"
          textContentType="password"
          returnKeyType="done"
          onChangeText={changeConfirmPassword}
        />

        <View className="gap-sm">
          <Checkbox
            label={DATA_CONSENT.text}
            checked={consentAccepted}
            disabled={isSubmitting}
            onChange={changeConsent}
          />
          {errors.consent && (
            <View className="flex-row items-start gap-xs">
              <Icon name="error" size={16} className="text-error" />
              <Text variant="body-m" tone="error" accessibilityRole="alert">
                {errors.consent}
              </Text>
            </View>
          )}
        </View>

        {errors.form && <Toast message={errors.form} tone="error" />}
        <Button
          label="Activar cuenta"
          fullWidth
          loading={isSubmitting}
          onPress={submit}
        />
      </ScrollView>
    </ScreenContainer>
  );
}
