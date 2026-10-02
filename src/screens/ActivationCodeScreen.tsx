import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { useCallback, useEffect } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TopBar } from '@/components/layout';
import { Button, Text, TextField } from '@/components/ui';
import { useActivationCode } from '@/hooks/useActivationCode';
import type { RootStackParamList } from '@/types/navigation';

type ActivationCodeScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'ActivationCode'
>;

/** Activación de cuenta, paso 1: el código que entregó el entrenador. */
export function ActivationCodeScreen({
  navigation,
  route,
}: ActivationCodeScreenProps) {
  const insets = useSafeAreaInsets();
  const goToPassword = useCallback(
    (activationCode: string) =>
      navigation.navigate('ActivationPassword', { activationCode }),
    [navigation],
  );
  const { code, error, isSubmitting, changeCode, markRejected, submit } =
    useActivationCode(goToPassword);

  const codeRejected = route.params?.codeRejected;
  useEffect(() => {
    if (codeRejected) {
      markRejected();
      navigation.setParams({ codeRejected: undefined });
    }
  }, [codeRejected, markRejected, navigation]);

  return (
    <View
      className="flex-1 bg-surface-background"
      style={{ paddingTop: insets.top }}
    >
      <TopBar title="Activar cuenta" onBack={navigation.goBack} />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        contentContainerClassName="gap-xl px-xl pb-8 pt-xl"
      >
        <View className="gap-xs">
          <Text variant="headline" accessibilityRole="header">
            Ingresa tu código
          </Text>
          <Text variant="body-l" tone="secondary">
            Tu entrenador te entregó un código de activación. Es válido por 72
            horas desde que lo generó.
          </Text>
        </View>

        <TextField
          label="Código de activación"
          leadingIcon="key"
          helper="Lo encuentras en el mensaje de tu entrenador."
          value={code}
          error={error}
          editable={!isSubmitting}
          autoCapitalize="characters"
          autoCorrect={false}
          autoComplete="off"
          returnKeyType="go"
          onChangeText={changeCode}
          onSubmitEditing={submit}
        />

        <Button
          label="Continuar"
          fullWidth
          loading={isSubmitting}
          onPress={submit}
        />
      </ScrollView>
    </View>
  );
}
