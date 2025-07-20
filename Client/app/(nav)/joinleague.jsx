import { useEffect } from "react";
import { ScrollView, Text, TouchableOpacity } from "react-native";
import { useLeagueStore } from "../../src/store/useLeagueStore.js";

function JoinLeague() {
  const { getleague, leagues, joinleague } = useLeagueStore();

  useEffect(() => {
    getleague();
  }, []);

  return (
    <ScrollView className="flex-1 p-3">
      {leagues &&
        leagues.map((league, index) => (
          <TouchableOpacity key={index} onPress={() => joinleague(league._id)} className="mb-4 p-4 rounded-xl bg-[#CCCCCC] boxShadow">
              <Text className="text-xl font-semibold text-blue-700 mb-2">{league.name}</Text>
              <Text>id: {league._id}</Text>
              <Text>Join fee: {league.joinfee}</Text>
              <Text>Start: {new Date(league.start).toDateString()}</Text>
              <Text>End: {new Date(league.end).toDateString()}</Text>
              <Text>life line per user: {league.lifelinePerUser}</Text>
              <Text>number of time team can repeat: {league.maxTimeTeamSelect}</Text>
              <Text>owner: {league.ownerName}</Text>
              <Text>weeks: {league.totalWeeks}</Text>
          </TouchableOpacity>
        ))}
    </ScrollView>
  );
}

export default JoinLeague;
