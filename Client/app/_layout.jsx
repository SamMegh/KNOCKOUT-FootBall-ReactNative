import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import ExpoStripeProvider from '../src/components/privateStripeProvider.jsx';
// Import your global CSS file
import "../global.css";
export default function RootLayout() {
  return (
    <ExpoStripeProvider >
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(nav)" />
      <Toast />
      <Toast />
    </Stack>
    </ExpoStripeProvider >
  );
}