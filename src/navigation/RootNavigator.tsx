import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { ActivationCodeScreen } from '@/screens/ActivationCodeScreen';
import { ActivationPasswordScreen } from '@/screens/ActivationPasswordScreen';
import { SignInScreen } from '@/screens/SignInScreen';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
import type { RootStackParamList } from '@/types/navigation';
import { MainTabs } from './MainTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Navegación de primer nivel. Sin sesión solo existen las pantallas de acceso
 * (bienvenida, inicio de sesión y activación); con sesión, solo las pestañas.
 */
export function RootNavigator() {
  const { status } = useAuth();

  if (status === 'restoring') {
    return <View className="flex-1 bg-surface-background" />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {status === 'signedIn' ? (
        <Stack.Screen name="Main" component={MainTabs} />
      ) : (
        <>
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen
            name="ActivationCode"
            component={ActivationCodeScreen}
          />
          <Stack.Screen
            name="ActivationPassword"
            component={ActivationPasswordScreen}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
