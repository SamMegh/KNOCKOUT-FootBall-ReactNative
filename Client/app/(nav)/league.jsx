import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useLeagueStore } from "../../src/store/useLeagueStore";

function MyLeague() {
  const { myleagues, getmyleagues } = useLeagueStore();
  const router = useRouter();

  useEffect(() => {
    getmyleagues();
  }, [getmyleagues]);

  const renderLeague = ({ item }) => {
    const scaleValue = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(scaleValue, {
        toValue: 0.96,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() =>
          router.push({
            pathname: "/leaguedata",
            params: { leagueid: item._id },
          })
        }
      >
        <Animated.View
          style={[
            styles.card,
            { transform: [{ scale: scaleValue }] },
          ]}
        >
          <View style={styles.headerRow}>
            <MaterialIcons name="emoji-events" size={24} color="#6C63FF" />
            <Text style={styles.title}>{item.name}</Text>
          </View>

          <Text style={styles.fee}>🏷️ Join Fee: ₹{item.joinfee}</Text>

          <Text style={styles.date}>
            🕒 Start: {new Date(item.start).toDateString()}
          </Text>
          <Text style={styles.date}>
            ⏳ End: {new Date(item.end).toDateString()}
          </Text>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F9FAFB",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10,
    color: "#333",
  },
  fee: {
    fontSize: 16,
    color: "#555",
    marginBottom: 6,
  },
  date: {
    fontSize: 14,
    color: "#777",
    marginBottom: 2,
  },
});
