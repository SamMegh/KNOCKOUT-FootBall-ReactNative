import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useLeagueStore } from "../../src/store/useLeagueStore.js";

function JoinLeague() {
  const { getleague, leagues, joinleague } = useLeagueStore();

  useEffect(() => {
    getleague();
  }, []);

  return (
    <View>
      {leagues &&
        leagues.map((league, index) => (
          <TouchableOpacity key={index} onPress={() => joinleague(league._id)}>
            <View
              style={{
                padding: 10,
                marginVertical: 5,
                backgroundColor: "#eee",
              }}
            >
              <Text>Name: {league.name}</Text>
              <Text>Join fee: {league.joinfee}</Text>
              <Text>Start: {new Date(league.start).toDateString()}</Text>
              <Text>End: {new Date(league.end).toDateString()}</Text>
              <Text>Type: {league.type}</Text>
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
}

export default JoinLeague;
