import { useRouter } from 'expo-router';
import { Text, TouchableOpacity, View } from 'react-native';

export default function App() {
  const router = useRouter();
  return (
   <View className="flex-1 items-center justify-center bg-red-100">
  <Text className="text-xl text-blue-600 font-bold">Tailwind is working! 🎉</Text>
    <TouchableOpacity onPress={()=>router.push("/home")}>
      <Text>
        Home Route
      </Text>
    </TouchableOpacity>
</View>

  );
}
