import { Ionicons } from "@expo/vector-icons";
import { Redirect, Tabs } from "expo-router";
import { Text, View } from "react-native";
import { useAuthStore } from "../../src/store/useAuthStore";

export default function TabsLayout() {
  const { isAuthUser } = useAuthStore();

  if (!isAuthUser) return <Redirect href="/" />;

  const CustomHeader = ({ title }) => {
    const formattedTitle =
      title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

    return (
      <View
        style={{
          paddingTop: 35,
          paddingBottom: 18,
          paddingHorizontal: 20,
          backgroundColor: "#dbeafe",
          borderBottomLeftRadius: 16,
          borderBottomRightRadius: 16,
          elevation: 4,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 3,
        }}
      >
        <Text
          style={{
            fontSize: 24,
            fontWeight: "800",
            color: "#1e40af",
          }}
        >
          ⚽ {formattedTitle}
        </Text>
        <Text
          style={{
            fontSize: 14,
            color: "#475569",
            marginTop: 4,
          }}
        >
          Explore your {formattedTitle} section.
        </Text>
      </View>
    );
  };

  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#9ca3af",
        tabBarStyle: {
          backgroundColor: "#ffffff",
          borderTopWidth: 0.3,
          borderTopColor: "#e5e7eb",
          height: 55,
          elevation: 2,
        },
        tabBarIcon: ({ color, focused }) => {
          switch (route.name) {
            case "home":
              return (
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={22}
                  color={color}
                />
              );
            case "league":
              return (
                <Ionicons
                  name={focused ? "trophy" : "trophy-outline"}
                  size={22}
                  color={color}
                />
              );
            case "profile":
              return (
                <Ionicons
                  name={focused ? "person" : "person-outline"}
                  size={22}
                  color={color}
                />
              );
            case "history":
              return (
                <Ionicons
                  name={focused ? "time" : "time-outline"}
                  size={22}
                  color={color}
                />
              );
            case "about":
              return (
                <Ionicons
                  name={
                    focused
                      ? "information-circle"
                      : "information-circle-outline"
                  }
                  size={22}
                  color={color}
                />
              );
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
  );
}
