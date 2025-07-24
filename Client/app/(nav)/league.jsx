import { useRouter } from "expo-router";
import { useEffect } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import { useLeagueStore } from "../../src/store/useLeagueStore";

function MyLeague() {
  const { myleagues, getmyleagues } = useLeagueStore();
  const router = useRouter();

  useEffect(() => {
    getmyleagues();
  }, [getmyleagues]);

  const renderLeague = ({ item }) => (
    <TouchableOpacity
      onPress={() =>
        router.push({
          pathname: "/leaguedata",
          params: { leagueid: item._id },
        })
      }
    >
      <View
        style={{
          backgroundColor: "#ffffff",
          borderRadius: 15,
          padding: 16,
          marginVertical: 8,
          marginHorizontal: 16,
          shadowColor: "#000",
          shadowOffset: { width: 2, height: 2 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          elevation: 1,
        }}
      >
        <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 4 }}>
          {item.name}
        </Text>
        <Text style={{ fontSize: 16, color: "#555" }}>
          Type : {(item.type).toUpperCase()}
        </Text>
        <Text style={{ fontSize: 14, color: "#777", marginTop: 4 }}>
          Start: {new Date(item.start).toDateString()}
        </Text>
        <Text style={{ fontSize: 14, color: "#777" }}>
          End: {new Date(item.end).toDateString()}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={{ flex: 1, backgroundColor: "#f6f8fa" }}>
      <FlatList
        data={myleagues}
        keyExtractor={(item) => item._id}
        renderItem={renderLeague}
        contentContainerStyle={{ paddingVertical: 16 }}
      />
    </View>
  );
}

export default MyLeague;
