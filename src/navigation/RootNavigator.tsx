import { View } from 'react-native';
import { useAuth } from '@/context/AuthContext';
import { AuthStack } from './AuthStack';
import { MainTabs } from './MainTabs';

/** Elige entre el acceso y las pestañas según el estado de la sesión. */
export function RootNavigator() {
  const { status } = useAuth();

  if (status === 'restoring') {
    return <View className="flex-1 bg-surface-background" />;
  }

  return status === 'signedIn' ? <MainTabs /> : <AuthStack />;
}
