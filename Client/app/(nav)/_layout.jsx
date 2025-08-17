import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { StyleSheet, View } from "react-native";
import CustomHeader from "../../src/components/customHeader";
import { useAuthStore } from "../../src/store/useAuthStore";
export default function TabsLayout() {
  const { isAuthUser } = useAuthStore();

  if (!isAuthUser) return <Redirect href="/" />;

  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* ✅ This header will show on ALL screens */}
      <CustomHeader title="Knockout" subtitle="Manage your leagues easily" />

      {/* ✅ Your tab navigation */}
      <Tabs
        screenOptions={({ route }) => ({
          headerShown: false, // make sure Tabs doesn't show its default header
          tabBarActiveTintColor: "#000",
          tabBarInactiveTintColor: "#9ca3af",
          tabBarStyle: styles.tabBar,
          tabBarIcon: ({ color, focused }) => {
            switch (route.name) {
              case "home":
                return <Ionicons name={focused ? "home" : "home-outline"} size={22} color={color} />;
              case "league":
                return <Ionicons name={focused ? "trophy" : "trophy-outline"} size={22} color={color} />;
              case "profile":
                return <Ionicons name={focused ? "person" : "person-outline"} size={22} color={color} />;
              default:
                return null;
            }
          },
          tabBarLabelStyle: {
            fontSize: 11,
            marginBottom: 2,
          },
        })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: "#fff",
    borderTopWidth: 0.3,
    borderTopColor: "#e5e7eb",
    height: 55,
    elevation: 2,
  },
});
