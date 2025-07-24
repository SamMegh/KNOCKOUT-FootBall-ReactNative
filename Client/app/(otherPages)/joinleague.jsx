import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { useLeagueStore } from "../../src/store/useLeagueStore";

const JoinLeague = () => {
  const { getleague, leagues, joinleague, removeLeague } = useLeagueStore();
  const router = useRouter();

  useEffect(() => {
    getleague();
  }, []);

  const confirmJoin = (league) => {
    if (Platform.OS === "web") {
      const ok = window.confirm(`Join "${league.name}"?`);
      if (ok) {
        joinleague(league._id);
        removeLeague(league._id);
      }
    } else {
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
        ],
        { cancelable: true }
      );
    }
  };

  if (!leagues) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.loadingText}>Loading leagues...</Text>
      </View>
    );
  }

  if (leagues.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noLeagueText}>No leagues available.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back-circle" size={26} color="#2563eb" />
          <Text style={styles.backText}>Back</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>🏆 Join a League</Text>
        <Text style={styles.headerSubtitle}>
          Browse and join leagues you want to participate in.
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {leagues.map((league) => (
          <TouchableOpacity
            key={league._id}
            onPress={() => confirmJoin(league)}
            style={styles.card}
          >
            <Text style={styles.leagueTitle}>{league.name}</Text>
            <Text style={styles.detail}>🆔 ID: {league._id}</Text>
            <Text style={styles.detail}>💰 Fee: ₹{league.joinfee}</Text>
            <Text style={styles.detail}>
              🕒 Start: {new Date(league.start).toDateString()}
            </Text>
            <Text style={styles.detail}>
              ⏳ End: {new Date(league.end).toDateString()}
            </Text>
            <Text style={styles.detail}>🎮 Type: {league.type}</Text>
            <Text style={styles.detail}>
              ❤️ Lifelines/User: {league.lifelinePerUser}
            </Text>
            <Text style={styles.detail}>
              🔁 Repeat Limit: {league.maxTimeTeamSelect}
            </Text>
            <Text style={styles.detail}>👑 Owner: {league.ownerName}</Text>
            <Text style={styles.detail}>📆 Weeks: {league.totalWeeks}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default JoinLeague;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f9ff",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: Platform.OS === "web" ? 20 : 40,
    paddingBottom: 20,
    backgroundColor: "#e0f2fe",
    borderBottomColor: "#bae6fd",
    borderBottomWidth: 1,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  backBtn: {
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
  scrollContent: {
    padding: 16,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  leagueTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1e40af",
    marginBottom: 8,
  },
  detail: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 2,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: "#334155",
  },
  noLeagueText: {
    fontSize: 18,
    color: "#64748b",
  },
});
