import { FontAwesome5, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { Redirect, useRouter } from "expo-router";
import { useEffect } from "react";
import {
  Animated,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useLeagueStore } from "../../src/store/useLeagueStore";

function CreateLeague() {
  const { getmecreatedleagues, myownleagues } = useLeagueStore();
  const router = useRouter();
  const { isAuthUser } = useAuthStore();

  useEffect(() => {
    getmecreatedleagues();
  }, [getmecreatedleagues]);

  if (!isAuthUser) return <Redirect href="/" />;

  const renderLeagueCard = (league, index) => {
    const scale = new Animated.Value(1);

    const onPressIn = () =>
      Animated.spring(scale, {
        toValue: 0.96,
        useNativeDriver: true,
      }).start();

    const onPressOut = () =>
      Animated.spring(scale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();

    return (
      <Pressable
        key={index}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={() =>
          router.push({
            pathname: "/leaguedata",
            params: { leagueid: league._id },
          })
        }
      >
        <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
          <View style={styles.headerRow}>
            <MaterialIcons name="sports-soccer" size={22} color="#4F46E5" />
            <Text style={styles.title}>{league.name}</Text>
          </View>
          <Text style={styles.detail}>🆔 ID: {league._id}</Text>
          <Text style={styles.detail}>
            🕒 Start: {new Date(league.start).toDateString()}
          </Text>
          <Text style={styles.detail}>
            ⏳ End: {new Date(league.end).toDateString()}
          </Text>
          <Text style={styles.detail}>📆 Total Weeks: {league.totalWeeks}</Text>
          <Text style={styles.detail}>💰 Join Fee: ₹{league.joinfee}</Text>
          <Text style={styles.detail}>🎮 Type: {league.type}</Text>
          <Text style={styles.detail}>
            ❤️ Life Lines / User: {league.lifelinePerUser}
          </Text>
          <Text style={styles.detail}>
            🔁 Team Repeat Limit: {league.maxTimeTeamSelect}
          </Text>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back-circle" size={26} color="#2563eb" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.heading}>⚽ Create New League</Text>
        <Text style={styles.subheading}>
          Fill out the details below to start your own league.
        </Text>
      </View>

      {/* Create New League Button */}
      <Pressable
        onPress={() => router.push("/createnewleague")}
        style={styles.createBtn}
      >
        <FontAwesome5 name="plus-circle" size={20} color="#fff" />
        <Text style={styles.createText}>Create New League</Text>
      </Pressable>

      {/* League List */}
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        {myownleagues.map(renderLeagueCard)}
      </ScrollView>
    </SafeAreaView>
  );
}

export default CreateLeague;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "#e0f2fe",
    borderBottomColor: "#bae6fd",
    borderBottomWidth: 1,
    borderRadius: 12,
    elevation: 2,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backText: {
    color: "#2563eb",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1e3a8a",
  },
  subheading: {
    fontSize: 14,
    color: "#334155",
    marginTop: 4,
  },
  createBtn: {
    flexDirection: "row",
    backgroundColor: "#4F46E5",
    marginHorizontal: 16,
    marginVertical: 16,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    elevation: 2,
  },
  createText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 18,
    marginHorizontal: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    marginLeft: 10,
    color: "#1F2937",
  },
  detail: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
  },
});
