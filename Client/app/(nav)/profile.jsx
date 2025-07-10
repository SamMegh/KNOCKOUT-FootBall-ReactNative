import { Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from "../../src/store/useAuthStore.js";

export default function Profile() {
  const { isAuthUser, logout } = useAuthStore();

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
      <TouchableOpacity className = 'text-xl font-bold text-center p-2 rounded bg-white text-white w-[30vw]'onPress={logout}>
        <Text>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}
