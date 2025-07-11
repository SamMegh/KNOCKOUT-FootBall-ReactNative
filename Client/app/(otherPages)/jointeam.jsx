import { Redirect, useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useEffect } from "react";

export default function JoinTeam() {
  const { isAuthUser } = useAuthStore();
  if (!isAuthUser) return <Redirect href="/login" />;
  const { id } = useLocalSearchParams();
  useEffect(()=>{
    
  })
  return (
    <View>
      <Text>League ID: {id}</Text>
    </View>
  );
}
