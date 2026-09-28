import './global.css';

import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TrainingFlow } from '@/screens/TrainingFlow';

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <TrainingFlow />
    </SafeAreaProvider>
  );
}
