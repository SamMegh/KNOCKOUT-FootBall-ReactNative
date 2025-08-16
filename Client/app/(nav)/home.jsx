import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useLeagueStore } from "../../src/store/useLeagueStore";

export default function Home() {
  const router = useRouter();
  const { leagues, getleague, joinleague, loading, myleagues, getmyleagues } = useLeagueStore();
  const { isAuthUser } = useAuthStore();
  const now = useMemo(() => new Date(), []);

  const tips = [
    "Build your dream team wisely",
    "Check player stats regularly",
    "Join public leagues to win rewards",
  ];

  useEffect(() => {
    (async () => {
      try {
        await getleague();
        await getmyleagues();
      } catch {
        Alert.alert("Error", "Failed to fetch leagues.");
      }
    })();
  }, []);

  const confirmJoin = (league) => {
    const handleJoin = () => {
      joinleague(league._id);
      removeLeague(league._id);
    };

    if (Platform.OS === "web") {
      if (window.confirm(`Join "${league.name}"?`)) handleJoin();
    } else {
      Alert.alert(
        "Join League",
        `Are you sure you want to join "${league.name}"?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Join", onPress: handleJoin },
        ],
        { cancelable: true }
      );
    }
  };

  const renderMyLeague = ({ item: league }) => (
    <TouchableOpacity
      key={league._id}
      style={styles.leagueCard}
      onPress={() =>
        router.push({
          pathname: "/leaguedata",
          params: { leagueid: league._id },
        })
      }
    >
      <View style={{ flex: 1 }}>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <MaterialIcons name="emoji-events" size={24} color="#f59e0b" />
          <Text style={styles.leagueName}>{league.name}</Text>
        </View>
        <Text style={styles.leagueMeta}>
          {now < new Date(league.end) ? "Upcoming" : "Ongoing"} •{" "}
          {league.type.charAt(0).toUpperCase() + league.type.slice(1)}
        </Text>
        <Text style={styles.leagueMeta}>
          Time: {league.start.split("T")[0]} to {league.end.split("T")[0]}
        </Text>
      </View>
      <Ionicons
        name={now < new Date(league.start) ? "time" : "flash"}
        size={22}
        color="#f59e0b"
      />
    </TouchableOpacity>
  );

  const renderPublicLeague = ({ item: league }) => (
    <View key={league._id} style={styles.publicCard}>
      <View>
        <Text style={styles.publicName}>{league.name}</Text>
        <Text style={styles.leagueData}>League Id: {league._id}</Text>
        <Text style={styles.leagueData}>
          Time: {league.start.split("T")[0]} to {league.end.split("T")[0]}
        </Text>
        <Text style={styles.leagueData}>Joining Fee: ₹{league.joinfee.amount}</Text>
        <Text style={styles.leagueData}>Owner: {league.ownerName}</Text>
      </View>
      <TouchableOpacity style={styles.joinButton} onPress={() => confirmJoin(league)}>
        <Text style={{ color: "#fff", fontWeight: "600" }}>Join</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <>        

      <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        <Text style={styles.heading}>Welcome, {isAuthUser?.name}!</Text>
  {/* Tips Section */}
  <View style={styles.tipsBox}>
    <Ionicons name="bulb-outline" size={24} color="#f59e0b" />
    <View style={{ marginLeft: 12 }}>
      <Text style={styles.tipsTitle}>Quick Tips</Text>
      {tips.map((tip, i) => (
        <Text key={i} style={styles.tipItem}>• {tip}</Text>
      ))}
    </View>
  </View>

  {/* My Leagues */}
  <Text style={styles.sectionTitle}>⚽ My Leagues</Text>
  {myleagues.map((league) => renderMyLeague({ item: league }))}

  {/* Public Leagues */}
  <Text style={styles.sectionTitle}>🌍 Public Leagues</Text>
  {loading ? (
    <ActivityIndicator size="large" color="#f59e0b" />
  ) : leagues?.length > 0 ? (
    leagues.map((league) => renderPublicLeague({ item: league }))
  ) : (
    <Text style={{ fontStyle: "italic", color: "#f59e0b" }}>
      No public leagues available yet.
    </Text>
  )}

  {/* Create League Button */}
  <TouchableOpacity style={styles.createButton} onPress={() => router.push("/createnewleague")}>
    <Text style={styles.createText}>+ Create New League</Text>
  </TouchableOpacity>
</ScrollView>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
    paddingHorizontal: 1,
    paddingTop: 1,
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "NedianMedium",
    color: "#fff",
    marginBottom: 21,
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginVertical: 12,
  },
  leagueCard: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#fff",
    shadowOpacity: 0.06,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
    alignItems: "center",
  },
  leagueName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  leagueMeta: {
    color: "#000",
    fontSize: 14,
    marginTop: 2,
  },
  publicCard: {
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderLeftWidth: 4,
    borderLeftColor: "#3b82f6",
  },
  publicName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
  },
  leagueData: {
    color: "#000",
    fontSize: 14,
    marginTop: 2,
  },
  joinButton: {
    backgroundColor: "#000",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  createButton: {
    marginTop: 20,
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  createText: {
    fontSize: 16,
    color: "#000",
    fontWeight: "700",
  },
  tipsBox: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    marginBottom: 20,
    elevation: 2,
    alignItems: "flex-start",
  },
  tipsTitle: {
    fontWeight: "700",
    fontSize: 15,
    color: "#000",
    marginBottom: 4,
  },
  tipItem: {
    fontSize: 13,
    color: "#000",
  },
});