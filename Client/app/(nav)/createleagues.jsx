import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useLeagueStore } from "../../src/store/useLeagueStore";
function createleague() {
  const { getmecreatedleagues, myownleagues } = useLeagueStore();
  const router = useRouter();
  const { isAuthUser } = useAuthStore();
  if (!isAuthUser) return <Redirect href="/" />;
  useEffect(() => {
    getmecreatedleagues();
  }, [getmecreatedleagues]);
  return (
    <SafeAreaView className='flex-1'>
      <TouchableOpacity
        className="m-4 p-4 rounded-xl bg-[#A4BCFF] boxShadow"
        onPress={() => router.push("/createnewleague")}
      >
        <Text>click here to create a league</Text>
      </TouchableOpacity>
      <ScrollView className="p-4"
      >
        {myownleagues.map((league, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => {
              router.push({
                pathname: "/leaguedata",
                params: { leagueid: league._id },
              });
            }}
            className="mb-4 p-4 rounded-xl bg-[#CCCCCC] boxShadow"
          >
            <Text className="text-xl font-semibold text-blue-700 mb-2">
              {league.name}
            </Text>
            <Text className="text-sm text-gray-800">Id : {league._id}</Text>
            <Text className="text-sm text-gray-800">
              Start : {new Date(league.start).toDateString()}
            </Text>
            <Text className="text-sm text-gray-800">
              End : {new Date(league.end).toDateString()}
            </Text>
            <Text className="text-sm text-gray-800">
              Total Weeks : {league.totalWeeks}
            </Text>
            <Text className="text-sm text-gray-800">
              Join Fee : {league.joinfee}
            </Text>
            <Text className="text-sm text-gray-800">
              Type : {league.type}
            </Text>
            <Text className="text-sm text-gray-800">
              life line per user : {league.lifelinePerUser}
            </Text>
            <Text className="text-sm text-gray-800">
              number of time team can repeat : {league.maxTimeTeamSelect}
            </Text>

          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

export default createleague;
