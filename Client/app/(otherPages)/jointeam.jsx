import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useLeagueStore } from "../../src/store/useLeagueStore";

export default function JoinTeam() {
  const { isAuthUser } = useAuthStore();
  const { myteam, getmyteam, getDayData, matchOfTheDay, jointeam } = useLeagueStore();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [showDropDown, setShowDropDown] = useState(false);
  const [loadingTeamData, setLoadingTeamData] = useState(false);
  const [data, setData] = useState({
    day: "",
    teamName: "",
    leagueId: "",
  });

  // Fetch team data initially
  useEffect(() => {
    if (id) {
      getmyteam(id);
    }
  }, [id]);

  // Fetch match data for the selected day when dropdown is shown
  useEffect(() => {
    if (showDropDown && data.day) {
      const fetchData = async () => {
        setLoadingTeamData(true);
        try {
          await getDayData(data.day);
        } catch (error) {
          console.error("Error fetching day data:", error);
        } finally {
          setLoadingTeamData(false);
        }
      };

      fetchData();
    }
  }, [showDropDown, data.day]);

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
    <SafeAreaView className="flex-1">
      <TouchableOpacity onPress={() => router.back()}>
        <Text className="text-base text-blue-600 mb-4">← Go Back</Text>
      </TouchableOpacity>

      <View className="p-4">
        <Text className="text-lg font-bold mb-2">User: {myteam.userName}</Text>
        <Text className="text-lg font-bold">League: {myteam.leagueName}</Text>
        <Text className="text-lg font-semibold mb-4">
          League ID: {myteam.leagueId}
        </Text>

        <View className="flex-row border-b border-gray-300 pb-2 mb-2">
          <Text className="flex-1 font-bold text-center">Day</Text>
          <Text className="flex-1 font-bold text-center">Team Name</Text>
        </View>

        <FlatList
          data={myteam.teams}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View className="flex-row py-2 border-b border-gray-200">
              <Text className="flex-1 text-center">
                {new Date(item.day).toDateString()}
              </Text>
              <Text
                className="flex-1 text-blue-500 underline text-center"
                onPress={() => {
                  setData({
                    day: item.day.split("T")[0],
                    teamName: item.teamName,
                    leagueId:myteam.leagueId
                  });
                  setShowDropDown(true);
                }}
              >
                {item.teamName}
              </Text>
            </View>
          )}
        />
      </View>

      {showDropDown && (
        <TouchableWithoutFeedback onPress={() => setShowDropDown(false)}>
          <View className="absolute inset-0 justify-center items-center bg-black bg-opacity-40">
            <TouchableWithoutFeedback>
              <View className="bg-blue-300 w-3/4 p-4 rounded">
                <Text
                  className=" text-right text-xl font-bold text-red-600 mb-2"
                  onPress={() => setShowDropDown(false)}
                >
                  ×
                </Text>

                {loadingTeamData ? (
                  <Text className="text-center">Loading Data...</Text>
                ) : (
                  <FlatList
                    data={matchOfTheDay}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                      <View className="flex-row items-center justify-between bg-slate-200 rounded p-2 m-1">
                        <Text className="font-bold" onPress={() => {jointeam(data.leagueId, data.day, item.home )}}>
                          {item.home}
                        </Text>
                        <Text className="mx-2 font-semibold">Vs</Text>
                        <Text className="font-bold">{item.away}</Text>
                      </View>
                    )}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
}
