// components/CustomHeader.jsx
import { Platform, StatusBar, View, Text, Image } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFonts } from "expo-font";


export default function CustomHeader({ title = "Home", subtitle }) {
  const formattedTitle =
    title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

      const [fontsLoaded] = useFonts({
    'NedianMedium': require('../../assets/fonts/Nedian-Medium.otf'),
  });
  if (!fontsLoaded) return null;

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        alignItems: "center",
        paddingBottom: 18,
      }}
    >
      <View
        style={{
          paddingVertical: 10,
          paddingHorizontal: 12,
        }}
      >
          <Image
          source={require("../../assets/images/knockout-logo.png")} // 👈 Adjust path if needed
          style={{ width: 132, height: 132, resizeMode: "contain" }}
        />

      </View>
    </SafeAreaView>
  );
}
