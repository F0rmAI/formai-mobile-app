/**
 * Root stack for signed-in and signed-out routes.
 *
 * @author Carlos
 * @packageDocumentation
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { ActivationCodeScreen } from '@/screens/ActivationCodeScreen';
import { ActivationPasswordScreen } from '@/screens/ActivationPasswordScreen';
import { ForgotPasswordScreen } from '@/screens/ForgotPasswordScreen';
import { PasswordResetSentScreen } from '@/screens/PasswordResetSentScreen';
import { ResetPasswordScreen } from '@/screens/ResetPasswordScreen';
import { SignInScreen } from '@/screens/SignInScreen';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
import { RoutineScreen } from '@/screens/RoutineScreen';
import { RoutineDayScreen } from '@/screens/RoutineDayScreen';
import { WorkoutSummaryScreen } from '@/screens/WorkoutSummaryScreen';
import { WorkoutHistoryScreen } from '@/screens/WorkoutHistoryScreen';
import { WorkoutDetailScreen } from '@/screens/WorkoutDetailScreen';
import type { RootStackParamList } from '@/types/navigation';
import { MainTabs } from './MainTabs';

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Top-level navigation switches between authentication and client screens.
 */
export function RootNavigator() {
  const { status } = useAuth();

  if (status === 'restoring') {
    return <View className="flex-1 bg-surface-background" />;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {status === 'signedIn' ? (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="Routine" component={RoutineScreen} />
          <Stack.Screen name="RoutineDay" component={RoutineDayScreen} />
          <Stack.Screen
            name="WorkoutSummary"
            component={WorkoutSummaryScreen}
          />
          <Stack.Screen
            name="WorkoutHistory"
            component={WorkoutHistoryScreen}
          />
          <Stack.Screen name="WorkoutDetail" component={WorkoutDetailScreen} />
          <Stack.Screen
            name="Reminders"
            getComponent={() =>
              // Lazy require avoids a circular init crash while MainTabs/Profile load.
              require('@/screens/RemindersScreen').RemindersScreen
            }
          />
        </>
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
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
          <Stack.Screen
            name="PasswordResetSent"
            component={PasswordResetSentScreen}
          />
          {/* Each link opens a fresh screen so a new token cannot inherit the previous state. */}
          <Stack.Screen
            name="ResetPassword"
            component={ResetPasswordScreen}
            getId={({ params }) => params?.token}
          />
        </>
      )}
    </Stack.Navigator>
  );
}
