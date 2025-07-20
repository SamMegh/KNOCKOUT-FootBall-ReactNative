import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/store/useAuthStore.js";
import { useLeagueStore } from "../../src/store/useLeagueStore.js";

function LeagueData() {
  const { leagueid } = useLocalSearchParams();
  const { isAuthUser } = useAuthStore();
  const router = useRouter();
  const { leagueTeams, getleagueteams, getmyteam, myteam } = useLeagueStore();

  if (!isAuthUser) return <Redirect href="/login" />;

  useEffect(() => {
    if (leagueid) {
      getmyteam(leagueid);
      getleagueteams(leagueid);
    }
  }, [leagueid, getleagueteams, getmyteam]);
const mergedLeagueData = myteam
  ? [myteam, ...leagueTeams.filter((team) => team.userId !== myteam.userId)]
  : leagueTeams;
const sortedLeagueData = mergedLeagueData.sort((a, b) =>
  a.userId === isAuthUser._id ? -1 : b.userId === isAuthUser._id ? 1 : 0
);
  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="p-4">
        <TouchableOpacity onPress={() => router.back()}>
          <Text className="text-base text-blue-600 mb-4">← Go Back</Text>
        </TouchableOpacity>

        {sortedLeagueData
          .sort((a, b) =>
            a.userId === isAuthUser._id
              ? -1
              : b.userId === isAuthUser._id
                ? 1
                : 0
          )
          .map((user, index) => (
            <TouchableOpacity
              key={index}
              disabled={isAuthUser._id !== user.userId}
              onPress={() => {
                if (isAuthUser._id === user.userId) {
                  router.push({
                    pathname: "/jointeam",
                    params: { id: user.leagueId },
                  });
                }
              }}
              className="mb-4 p-4 rounded-xl boxShadow"
              style={{
                backgroundColor:
                  isAuthUser._id === user.userId ? "#A4BCFF" : "#CCCCCC",
              }}
            >
              <Text className="text-xl font-semibold text-blue-700 mb-2">
                {user.userName}'s Team
              </Text>

              {user.teams.map((team, idx) => (
                <View key={idx} className="mb-1 pl-2">
                  <Text className="text-sm text-gray-800">
                    * {new Date(team.day).toDateString()} — {team.teamName}
                  </Text>
                </View>
              ))}
            </TouchableOpacity>
          ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default LeagueData;
