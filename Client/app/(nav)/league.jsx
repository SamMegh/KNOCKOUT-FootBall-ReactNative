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
        <Animated.View style={[styles.card, { transform: [{ scale: scaleValue }] }]}>
          <View style={styles.headerRow}>
            <MaterialIcons name="emoji-events" size={24} color="#6C63FF" />
            <Text style={styles.title}>{item.name}</Text>
          </View>

          <Text style={styles.fee}>🏷️ Join Fee: {item.joinfee.type} {item.joinfee.amount}</Text>
          <Text style={styles.date}>🕒 Start: {new Date(item.start).toDateString()}</Text>
          <Text style={styles.date}>⏳ End: {new Date(item.end).toDateString()}</Text>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Action Buttons */}
      <View style={styles.topButtons}>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/joinleague")}
        >
          <Text style={styles.buttonText}>Join League</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.createButton]}
          onPress={() => router.push("/createleague")}
        >
          <Text style={styles.buttonText}>Create League</Text>
        </Pressable>
      </View>

      {/* League List */}
      <FlatList
        data={myleagues}
        keyExtractor={(item) => item._id}
        renderItem={renderLeague}
        contentContainerStyle={{ paddingBottom: 16 }}
      />
    </View>
  );
}

export default MyLeague;

const styles = StyleSheet.create({
   container: {
    backgroundColor: '#000',
    flex: 1,
    paddingHorizontal: 1,
    paddingTop: 1,
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
  },
  topButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom:8,
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: "#6C63FF",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  createButton: {
    backgroundColor: "#10B981", // Emerald green
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1f2937",
    marginLeft: 10,
  },
  fee: {
    fontSize: 16,
    color: "#6B7280",
    marginBottom: 8,
  },
  date: {
    fontSize: 14,
    color: "#9CA3AF",
    marginBottom: 2,
  },
});
