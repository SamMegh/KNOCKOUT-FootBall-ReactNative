import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/store/useAuthStore.js";
import { useLeagueStore } from "../../src/store/useLeagueStore.js";
import CustomHeader from "../../src/components/customHeader.jsx";

function LeagueData() {
  const { leagueid } = useLocalSearchParams();
  const { isAuthUser } = useAuthStore();
  const router = useRouter();
  const { leagueTeams, getleagueteams, getmyteam, myteam } = useLeagueStore();

  if (!isAuthUser) return <Redirect href="/" />;

  useEffect(() => {
    if (leagueid) {
      getmyteam(leagueid);
      getleagueteams(leagueid);
    }
    else{
      router.back();
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
             <CustomHeader title="Knockout" subtitle="Manage your leagues easily" />
      <ScrollView className="px-8  py-10 bg-black rounded-t-[40px]">
     

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
