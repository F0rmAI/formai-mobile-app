import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignInScreen } from '@/screens/SignInScreen';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
import type { RootStackParamList } from '@/types/navigation';
import { MainTabs } from './MainTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

/** Navegación de primer nivel: bienvenida, inicio de sesión y pestañas principales. */
export function RootNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="Welcome" component={WelcomeScreen} />
      <Stack.Screen name="SignIn" component={SignInScreen} />
      <Stack.Screen name="Main" component={MainTabs} />
    </Stack.Navigator>
  );
}
