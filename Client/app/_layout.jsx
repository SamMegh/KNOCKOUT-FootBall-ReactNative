import { Stack } from "expo-router";
import Toast from "react-native-toast-message";
// Import your global CSS file
import "../global.css";
export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="(nav)" />
      <Toast />
    </Stack>
  );
}