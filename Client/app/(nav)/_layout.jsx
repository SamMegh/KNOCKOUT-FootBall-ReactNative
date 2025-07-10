import { Redirect } from 'expo-router';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function NavLayout() {
  const { isAuthUser } = useAuthStore();
  if (!isAuthUser) return <Redirect href="/login" />;

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        screenOptions={({ route }) => ({
          headerShown: true,
          drawerStyle: {
            backgroundColor: '#fff',
            width: 240,
          },
          headerStyle: {
            backgroundColor: '#2b2b2b',
          },
          headerTintColor: '#fff',
          title: route.name.charAt(0).toUpperCase() + route.name.slice(1),
        })}
      />
    </GestureHandlerRootView>
  );
}
