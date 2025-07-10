import { Text, View } from 'react-native';
import { useAuthStore } from "../../src/store/useAuthStore.js";

export default function Profile() {
  const { isAuthUser } = useAuthStore();

  if (!isAuthUser) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <Text className="text-white">Unable to get details.</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 justify-center items-center bg-black space-y-2">
      <Text className="text-white text-xl">User ID: {isAuthUser._id}</Text>
      <Text className="text-white text-xl">Name: {isAuthUser.name}</Text>
      <Text className="text-white text-xl">Email: {isAuthUser.email}</Text>
    </View>
  );
}
