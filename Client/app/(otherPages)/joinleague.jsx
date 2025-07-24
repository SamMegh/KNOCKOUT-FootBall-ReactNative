import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useLeagueStore } from "../../src/store/useLeagueStore";

function JoinLeague() {
  const { getleague, leagues, joinleague, removeLeague } = useLeagueStore();
  const router = useRouter();

  useEffect(() => {
    getleague();
  }, []);

  const renderLeagueCard = (league) => {
    const scale = new Animated.Value(1);

    const onPressIn = () =>
      Animated.spring(scale, {
        toValue: 0.96,
        useNativeDriver: true,
      }).start();

    const onPressOut = () =>
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
      }).start();

    const handleJoin = () => {
      Alert.alert(
        "Join League",
        `Are you sure you want to join "${league.name}"?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Join",
            onPress: () => {
              joinleague(league._id);
              removeLeague(league._id);
            },
          },
        ]
      );
    };

    return (
      <TouchableOpacity
        key={league._id}
        onPressIn={onPressIn}
        onPressOut={onPressOut}
        onPress={handleJoin}
        activeOpacity={0.9}
      >
        <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
          <Text style={styles.leagueName}>{league.name}</Text>
          <Text style={styles.detail}>🆔 ID: {league._id}</Text>
          <Text style={styles.detail}>💰 Join fee: ₹{league.joinfee}</Text>
          <Text style={styles.detail}>🕒 Start: {new Date(league.start).toDateString()}</Text>
          <Text style={styles.detail}>⏳ End: {new Date(league.end).toDateString()}</Text>
          <Text style={styles.detail}>🎮 Type: {league.type}</Text>
          <Text style={styles.detail}>❤️ Life lines: {league.lifelinePerUser}</Text>
          <Text style={styles.detail}>🔁 Repeat limit: {league.maxTimeTeamSelect}</Text>
          <Text style={styles.detail}>👑 Owner: {league.ownerName}</Text>
          <Text style={styles.detail}>📆 Weeks: {league.totalWeeks}</Text>
        </Animated.View>
      </TouchableOpacity>
    );
  };

  if (!leagues) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
        <Text style={styles.loadingText}>Loading leagues...</Text>
      </View>
    );
  }

  if (leagues.length === 0) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.noDataText}>No leagues available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backRow}>
          <Ionicons name="arrow-back-circle" size={26} color="#2563eb" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>⚽ Join a League</Text>
        <Text style={styles.headerSubtitle}>Select a league to participate in!</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {leagues.map(renderLeagueCard)}
      </ScrollView>
    </View>
  );
}

export default JoinLeague;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "#e0f2fe",
    borderBottomColor: "#bae6fd",
    borderBottomWidth: 1,
    borderRadius: 12,
    elevation: 2,
  },
  backRow: {
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
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1e3a8a",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#334155",
    marginTop: 4,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  leagueName: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1D4ED8",
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: "#374151",
    marginBottom: 3,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#4B5563",
  },
  noDataText: {
    fontSize: 16,
    color: "#6B7280",
  },
});
