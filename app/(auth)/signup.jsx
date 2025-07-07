import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function signup() {
  return (
    <SafeAreaView className="flex-1 bg-[#2b2b2b]">
      <View className="flex-1 justify-center items-center px-4">
          <Text className="text-white text-3xl font-bold ">KnockOut</Text>
          <Text className="text-white text-xl font-normal mb-6">Let's Create Account</Text>
          
      </View>
    </SafeAreaView>
  );
}
