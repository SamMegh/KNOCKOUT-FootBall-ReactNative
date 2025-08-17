// components/CustomHeader.jsx
import { useFonts } from "expo-font";
import { Image, Platform, StatusBar, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function CustomHeader({ title = "Home", subtitle }) {
  const [fontsLoaded] = useFonts({
    'NedianMedium': require('../../assets/fonts/Nedian-Medium.otf'),
  });

  if (!fontsLoaded) return null;

  const formattedTitle =
    title.charAt(0).toUpperCase() + title.slice(1).toLowerCase();

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#fff",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight/4 : 0,
        paddingBottom: Platform.OS === "android" ? StatusBar.currentHeight/4 : 0 ,
        alignItems: "center",
      }}
    >
      <View
        style={{
          alignItems: "center",
          justifyContent: "center",
          display:"flex",
          flexDirection:"row",
          justifyContent:"center",
          alignItems:"center",
          gap:10
        }}
      >
        
        <Image
          source={require("../../assets/images/knockout-logo.png")}
          style={{ width: 80, height: 80, resizeMode: "contain" }}
        />
        
        <View>
        <Text
          style={{
            fontFamily: 'NedianMedium',
            fontSize: 18,
            color: "#000",
          }}
        >
          {formattedTitle}
          
        </Text>
        {subtitle && (
          <Text
            style={{
              fontFamily: 'NedianMedium',
              fontSize: 14,
              color: "#666",
            }}
          >
            {subtitle}
          </Text>
        )}
        </View>
      </View>
    </SafeAreaView>
  );
}
