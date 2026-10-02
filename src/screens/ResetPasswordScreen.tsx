import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/layout';
import { Button, EmptyState, Text, TextField, Toast } from '@/components/ui';
import { useResetPassword } from '@/hooks/useResetPassword';
import type { RootStackParamList } from '@/types/navigation';

type ResetPasswordScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ResetPassword'
>;

/** Recuperación de contraseña, paso 2: nueva contraseña desde el enlace del correo. */
export function ResetPasswordScreen({
  navigation,
  route,
}: ResetPasswordScreenProps) {
  const insets = useSafeAreaInsets();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Cambiar la contraseña no deja sesión abierta: el cliente continúa en el inicio de sesión.
  const onReset = useCallback(() => {
    // Si el enlace se pidió desde esta app, se conoce el correo y se precarga.
    const sent = navigation
      .getState()
      .routes.find(({ name }) => name === 'PasswordResetSent');
    const email = (sent?.params as { email?: string } | undefined)?.email;
    navigation.reset({
      index: 1,
      routes: [
        { name: 'Welcome' },
        { name: 'SignIn', params: { passwordUpdated: true, email } },
      ],
    });
  }, [navigation]);

  const {
    password,
    confirmPassword,
    errors,
    isSubmitting,
    isLinkExpired,
    changePassword,
    changeConfirmPassword,
    submit,
  } = useResetPassword(route.params?.token, onReset);

  if (isLinkExpired) {
    return (
      <View
        className="flex-1 bg-surface-background"
        style={{ paddingTop: insets.top }}
      >
        <TopBar title="Recuperar contraseña" onBack={navigation.goBack} />
        <View className="flex-1 justify-center px-xl pb-8">
          <EmptyState
            icon="link_off"
            tone="error"
            title="Este enlace ya no es válido"
            description="El enlace venció o ya se usó. Solicita uno nuevo para crear tu contraseña."
            action={{
              label: 'Solicitar un nuevo enlace',
              icon: 'refresh',
              // El enlace ya no sirve: no se puede volver a esta pantalla.
              onPress: () =>
                navigation.replace('ForgotPassword', { renewal: true }),
            }}
          />
        </View>
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-surface-background"
      style={{ paddingTop: insets.top }}
    >
      <TopBar title="Nueva contraseña" onBack={navigation.goBack} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        contentContainerClassName="gap-xl px-xl pb-8 pt-xl"
      >
        <View className="gap-xs">
          <Text variant="headline" accessibilityRole="header">
            Crea una nueva contraseña
          </Text>
          <Text variant="body-l" tone="secondary">
            Usa al menos 8 caracteres, con letras y números.
          </Text>
        </View>

        <TextField
          label="Nueva contraseña"
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
          autoComplete="new-password"
          textContentType="newPassword"
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
          autoComplete="new-password"
          textContentType="newPassword"
          returnKeyType="go"
          onChangeText={changeConfirmPassword}
          onSubmitEditing={submit}
        />

        {errors.form && <Toast message={errors.form} tone="error" />}
        <Button
          label="Guardar contraseña"
          fullWidth
          loading={isSubmitting}
          onPress={submit}
        />
      </ScrollView>
    </View>
  );
}
