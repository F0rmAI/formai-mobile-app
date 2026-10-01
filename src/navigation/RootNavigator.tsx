import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivationCodeScreen } from '@/screens/ActivationCodeScreen';
import { ActivationPasswordScreen } from '@/screens/ActivationPasswordScreen';
import { SignInScreen } from '@/screens/SignInScreen';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
import type { RootStackParamList } from '@/types/navigation';
import { MainTabs } from './MainTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Navegación de primer nivel: bienvenida, inicio de sesión, activación de cuenta y pestañas. */
export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="ActivationCode" component={ActivationCodeScreen} />
      <Stack.Screen
        name="ActivationPassword"
        component={ActivationPasswordScreen}
      />
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
}
