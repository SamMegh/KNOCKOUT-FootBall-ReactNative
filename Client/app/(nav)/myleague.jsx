import { useRouter } from "expo-router";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useLeagueStore } from "../../src/store/useLeagueStore";

function myleague() {
  const { myleagues, getmyleagues } = useLeagueStore();
  const router = useRouter();
  useEffect(() => {
    getmyleagues();
  }, [getmyleagues]);
  return (
    <View>
      {myleagues &&
        myleagues.map((league, index) => (
          <TouchableOpacity
            key={index}
            onPress={() =>
              router.push({
                pathname: "/jointeam",
                params: { id: league._id },
              })
            }
          >
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
            </View>
          </TouchableOpacity>
        ))}
    </View>
  );
}

export default myleague;
