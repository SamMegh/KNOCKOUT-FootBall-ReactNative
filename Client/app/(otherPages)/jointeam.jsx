import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useLeagueStore } from "../../src/store/useLeagueStore";

export default function JoinTeam() {
  const { isAuthUser } = useAuthStore();
  const { myteam, getmyteam } = useLeagueStore();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  useEffect(() => {
    if (id) getmyteam(id);
  }, [id]);

  if (!isAuthUser) return <Redirect href="/login" />;

  if (!myteam) {
    return (
      <SafeAreaView>
      <View className="flex-1 justify-center items-center">
        <Text className="text-base">Loading team data...</Text>
      </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-base text-blue-600 mb-4">← Go Back</Text>
        </TouchableOpacity>
    <View className="p-4">
      <Text className="text-lg font-bold mb-2">User: {myteam.userName}</Text>
      <Text className="text-lg font-bold ">League: {myteam.leagueName}</Text>
      <Text className="text-lg font-semibold mb-4">League: {myteam.leagueId}</Text>

      <View className="flex-row border-b border-gray-300 pb-2 mb-2">
        <Text className="flex-1 font-bold">Day</Text>
        <Text className="flex-1 font-bold">Team Name</Text>
      </View>

      <FlatList
        data={myteam.teams}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View className="flex-row py-2 border-b border-gray-200">
            <Text className="flex-1">{new Date(item.day).toLocaleDateString()}</Text>
            <Text className="flex-1">{item.teamName}</Text>
          </View>
        )}
      />
    </View>
    </SafeAreaView>
  );
}
