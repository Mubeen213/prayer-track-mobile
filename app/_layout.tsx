import { Slot } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../styles/global.css'
export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-gray-50 pt-10" edges={['left', 'right', 'bottom']}
      >
      <Slot />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
