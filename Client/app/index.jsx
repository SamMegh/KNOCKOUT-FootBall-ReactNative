import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function App() {
  const router = useRouter();

  return (
    <SafeAreaView className="flex-1 bg-[#2b2b2b]">
      <View className="flex-1 justify-center items-center px-4 text-center">
          <Text className="text-white text-xl mb-2">Welcome to</Text>
          <Text className="text-white text-3xl font-bold mb-6">KnockOut</Text>
        <View className="w-full">
          <TouchableOpacity
            className="bg-blue-500 p-3 mb-4 rounded-lg"
            onPress={() => router.push("/signup")}
          >
            <Text className="text-xl font-semibold text-center text-white">
              SignUp
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-blue-500 p-3 rounded-lg"
            onPress={() => router.push("/login")}
          >
            <Text className="text-xl font-semibold text-center text-white">
              LogIn
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
