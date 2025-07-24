import { Redirect, Tabs } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useAuthStore } from '../../src/store/useAuthStore';

export default function TabsLayout() {
  const { isAuthUser } = useAuthStore();

  if (!isAuthUser) return <Redirect href="/" />;

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: true,
        tabBarActiveTintColor: '#2563eb',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopWidth: 0.3,
          borderTopColor: '#e5e7eb',
          height: 60,
          elevation: 1,
        },
        tabBarIcon: ({ focused, color, size }) => {
          switch (route.name) {
            case 'home':
              return (
                <Ionicons
                  name={focused ? 'home' : 'home-outline'}
                  size={22}
                  color={color}
                />
              );
            case 'leagues':
              return (
                <MaterialCommunityIcons
                  name="trophy" // Only solid trophy available
                  size={22}
                  color={color}
                />
              );
            case 'profile':
              return (
                <FontAwesome5
                  name="user-alt"
                  size={20}
                  color={color}
                />
              );
            default:
              return (
                <Ionicons
                  name="ellipse-outline"
                  size={22}
                  color={color}
                />
              );
          }
        },
        headerStyle: {
          backgroundColor: '#fff',
          borderBottomWidth: 0.3,
          borderBottomColor: '#e5e7eb',
          elevation: 1,
        },
        headerTitleStyle: {
          color: '#111827',
          fontWeight: '600',
          fontSize: 18,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          marginBottom: 2,
        },
      })}
    />
  );
}
