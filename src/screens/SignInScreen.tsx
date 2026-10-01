import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/layout';
import { Button, Text, TextField, Toast } from '@/components/ui';
import { useSignIn } from '@/hooks/useSignIn';
import type { RootStackParamList } from '@/types/navigation';

type SignInScreenProps = NativeStackScreenProps<RootStackParamList, 'SignIn'>;

/** Inicio de sesión del cliente con correo y contraseña. */
export function SignInScreen({ navigation, route }: SignInScreenProps) {
  const insets = useSafeAreaInsets();
  const activatedEmail = route.params?.activatedEmail;
  const [showPassword, setShowPassword] = useState(false);
  const {
    email,
    password,
    errors,
    isSubmitting,
    changeEmail,
    changePassword,
    submit,
  } = useSignIn(activatedEmail);

  return (
    <View
      className="flex-1 bg-surface-background"
      style={{ paddingTop: insets.top }}
    >
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
            Ingresa con el correo que registró tu entrenador.
          </Text>
        </View>

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

        {/* La recuperación de contraseña se conecta con FE-MOB-005. */}
        <Button label="¿Olvidaste tu contraseña?" variant="ghost" size="sm" />
        <Button
          label="Iniciar sesión"
          fullWidth
          loading={isSubmitting}
          onPress={submit}
        />
      </ScrollView>
      {activatedEmail && (
        <View
          className="absolute inset-x-xl"
          style={{ bottom: insets.bottom + 16 }}
        >
          <Toast message="Cuenta activada" tone="success" />
        </View>
      )}
    </View>
  );
}
