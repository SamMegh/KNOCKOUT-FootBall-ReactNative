import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
import ExpoStripeProvider from '../src/components/privateStripeProvider.jsx';
// Import your global CSS file
import { StatusBar } from "react-native";
import "../global.css";
export default function RootLayout() {
  return (
    <>
    <StatusBar barStyle="dark-content" backgroundColor="#fff" />
    <ExpoStripeProvider >
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(nav)" />      
    </Stack>
    <Toast />
    </ExpoStripeProvider >
    </>
  );
}