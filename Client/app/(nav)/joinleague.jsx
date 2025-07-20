import { useEffect } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLeagueStore } from "../../src/store/useLeagueStore.js";

function JoinLeague() {
  const { getleague, leagues, joinleague, removeLeague } = useLeagueStore();

  useEffect(() => {
    getleague();
  }, []);

  if (!leagues) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="#0000ff" />
        <Text className="mt-4">Loading leagues...</Text>
      </View>
    );
  }

  if (leagues.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text>No leagues available.</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 p-3">
      {leagues.map((league) => (
        <TouchableOpacity
          key={league._id}
          onPress={() => {
            joinleague(league._id);
            removeLeague(league._id);
          }}
          className="mb-4 p-4 rounded-xl bg-[#CCCCCC] boxShadow"
        >
          <Text className="text-xl font-semibold text-blue-700 mb-2">
            {league.name}
          </Text>
          <Text>id: {league._id}</Text>
          <Text>Join fee: {league.joinfee}</Text>
          <Text>Start: {new Date(league.start).toDateString()}</Text>
          <Text>End: {new Date(league.end).toDateString()}</Text>
          <Text>Life line per user: {league.lifelinePerUser}</Text>
          <Text>
            Number of time team can repeat: {league.maxTimeTeamSelect}
          </Text>
          <Text>Owner: {league.ownerName}</Text>
          <Text>Weeks: {league.totalWeeks}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

export default JoinLeague;
