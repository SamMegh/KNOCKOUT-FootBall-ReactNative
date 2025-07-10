import Ionicons from "@expo/vector-icons/Ionicons";
import { Redirect, Tabs } from "expo-router";
import { Colors } from "../../assets/Colors";
import { useAuthStore } from "../../src/store/useAuthStore";

export default function TabLayout() {
  const {isAuthUser}=useAuthStore();
  console.log(isAuthUser)
  if (!isAuthUser) return <Redirect href="/login" />;  
  return (
    <Tabs
      screenOptions={{
        headerShown: true,
        tabBarActiveTintColor: Colors.PRIMARY,
        tabBarStyle: {
          backgroundColor: Colors.SECONDARY,
          padding: 14,
          height: 75,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: "History",
          tabBarIcon: ({ color }) => (
            <Ionicons name="time" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person-sharp" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
