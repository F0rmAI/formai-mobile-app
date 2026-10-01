/**
 * Root component of the app.
 *
 * @author G0nz4loQu3dena
 * @packageDocumentation
 */

import './global.css';

import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { HomeScreen } from '@/screens/HomeScreen';

/**
 * Mounts the providers and the root screen of the app.
 */
export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <HomeScreen />
    </SafeAreaProvider>
  );
}
