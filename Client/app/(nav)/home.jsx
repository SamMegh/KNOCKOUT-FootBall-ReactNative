import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useLeagueStore } from "../../src/store/useLeagueStore";
import { useFonts } from "expo-font";

export default function Home() {
  const [fontsLoaded] = useFonts({
    'NedianMedium': require('../../assets/fonts/Nedian-Medium.otf'),
  });

  const router = useRouter();
  const {
    leagues,
    removeLeague,
    getleague,
    joinleague,
    loading,
    myleagues,
    getmyleagues,
  } = useLeagueStore();
  const { isAuthUser, coinUpdates } = useAuthStore();
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
    coinUpdates();
  }, [coinUpdates]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#f59e0b" />
      </View>
    );
  }

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
      style={styles.gridCard}
      onPress={() =>
        router.push({
          pathname: "/leaguedata",
          params: { league: JSON.stringify(league) },
        })
      }
    >
      <View>
        <Text style={styles.leagueName}>{league.name}</Text>
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
        size={20}
        color="#f59e0b"
        style={{ marginTop: 8 }}
      />
    </TouchableOpacity>
  );

  const renderPublicLeague = ({ item: league }) => (
    <View key={league._id} style={styles.gridCard}>
      <View>
        <Text style={styles.leagueName}>{league.name}</Text>
        <Text style={styles.leagueMeta}>League Id: {league._id}</Text>
        <Text style={styles.leagueMeta}>
          Time: {league.start.split("T")[0]} to {league.end.split("T")[0]}
        </Text>
        <Text style={styles.leagueMeta}>
          Joining Fee: {league.joinfee.type} {league.joinfee.amount}
        </Text>
        <Text style={styles.leagueMeta}>Owner: {league.ownerName}</Text>
      </View>
      <TouchableOpacity
        style={styles.joinButton}
        onPress={() => confirmJoin(league)}
      >
        <Text style={styles.joinButtonText}>Join</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <Text style={styles.heading}>Welcome, {isAuthUser?.name}!</Text>

        {/* Tips Section */}
        <View style={styles.tipsBox}>
          <Ionicons name="bulb-outline" size={24} color="#f59e0b" />
          <View style={{ marginLeft: 12 }}>
            <Text style={styles.tipsTitle}>Quick Tips</Text>
            {tips.map((tip, i) => (
              <Text key={i} style={styles.tipItem}>
                • {tip}
              </Text>
            ))}
          </View>
        </View>

        {/* My Leagues */}
        <Text style={styles.sectionTitle}>⚽ My Leagues</Text>
        <FlatList
          data={myleagues.slice(0, 4)}
          renderItem={renderMyLeague}
          keyExtractor={(item) => item._id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: "space-between" }}
          scrollEnabled={false}
        />
        {myleagues.length > 4 && (
          <TouchableOpacity
            onPress={() => router.push("/league")}
            style={styles.viewMoreBtn}
          >
            <Text style={styles.viewMoreText}>View More</Text>
          </TouchableOpacity>
        )}

        {/* Public Leagues */}
        <Text style={styles.sectionTitle}>🌍 Public Leagues</Text>
        {loading ? (
          <ActivityIndicator size="large" color="#f59e0b" />
        ) : leagues?.length > 0 ? (
          <>
            <FlatList
              data={leagues.slice(0, 4)}
              renderItem={renderPublicLeague}
              keyExtractor={(item) => item._id}
              numColumns={2}
              columnWrapperStyle={{ justifyContent: "space-between" }}
              scrollEnabled={false}
            />
            {leagues.length > 3 && (
              <TouchableOpacity
                onPress={() => router.push("/joinleague")}
                style={styles.viewMoreBtn}
              >
                <Text style={styles.viewMoreText}>View More</Text>
              </TouchableOpacity>
            )}
          </>
        ) : (
          <Text style={styles.noLeaguesText}>
            No public leagues available yet.
          </Text>
        )}

        {/* Create League Button */}
        <TouchableOpacity
          style={styles.createButton}
          onPress={() => router.push("/createnewleague")}
        >
          <Text style={styles.createText}>+ Create New League</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
    paddingHorizontal: 16,
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
    fontFamily: "NedianMedium",
  },
  gridCard: {
    backgroundColor: "#fff",
    flex: 1,
    margin: 6,
    borderRadius: 12,
    padding: 12,
    elevation: 2,
    minHeight: 140,
    justifyContent: "space-between",
  },
  leagueName: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "NedianMedium",
    color: "#000",
  },
  leagueMeta: {
    color: "#000",
    fontSize: 14,
    marginTop: 2,
    fontFamily: "NedianMedium",
  },
  joinButton: {
    backgroundColor: "#000",
    marginTop: 10,
    paddingVertical: 8,
    borderRadius: 8,
  },
  joinButtonText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontFamily: "NedianMedium",
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
    fontFamily: "NedianMedium",
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
    fontFamily: "NedianMedium",
    fontSize: 15,
    color: "#000",
    marginBottom: 4,
  },
  tipItem: {
    fontSize: 13,
    color: "#000",
    fontFamily: "NedianMedium",
  },
  viewMoreBtn: {
    paddingVertical: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  viewMoreText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "NedianMedium",
    color: "#3b82f6",
  },
  noLeaguesText: {
    fontStyle: "italic",
    color: "#f59e0b",
    fontFamily: "NedianMedium",
  },
});
