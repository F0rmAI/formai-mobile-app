/**
 * Root component of the app.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import './global.css';

import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '@/context/AuthContext';
import { linking } from '@/navigation/linking';
import { RootNavigator } from '@/navigation/RootNavigator';

/**
 * Mounts the providers and the root screen of the app.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <AuthProvider>
        <NavigationContainer linking={linking}>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
