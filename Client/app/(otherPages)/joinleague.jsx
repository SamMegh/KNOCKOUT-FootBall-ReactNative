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
import { useFonts } from "expo-font";

import { useLeagueStore } from "../../src/store/useLeagueStore";
import CustomHeader from "../../src/components/customHeader";

const JoinLeague = () => {
  const { getleague, leagues, joinleague, removeLeague } = useLeagueStore();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    NedianMedium: require("../../assets/fonts/Nedian-Medium.otf"),
  });

  useEffect(() => {
    getleague();
  }, []);

  const confirmJoin = (league) => {
    const onConfirm = () => {
      joinleague(league._id);
      removeLeague(league._id);
    };

    if (Platform.OS === "web") {
      if (window.confirm(`Join "${league.name}"?`)) onConfirm();
    } else {
      Alert.alert("Join League", `Are you sure you want to join "${league.name}"?`, [
        { text: "Cancel", style: "cancel" },
        { text: "Join", onPress: onConfirm },
      ]);
    }
  };

  if (!fontsLoaded) return null;

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
      <View style={styles.container}>
        <CustomHeader title="Knockout" subtitle="Manage your leagues easily" />
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>⋞⋞</Text>
        </TouchableOpacity>
        <Text style={[styles.centered, { fontFamily: "NedianMedium", fontSize: 16 }]}>
          No leagues available.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CustomHeader title="Knockout" subtitle="Manage your leagues easily" />
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>⋞⋞</Text>
      </TouchableOpacity>

      <View style={styles.containermain}>
        <Text style={styles.headerTitle}>🏆Join if you want to Win.</Text>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {leagues.map((league) => (
            <TouchableOpacity
              key={league._id}
              onPress={() => confirmJoin(league)}
              style={styles.card}
            >
              <Text style={styles.leagueTitle}>{league.name}</Text>
              <Text style={styles.detail}>🆔 ID: {league._id}</Text>
              <Text style={styles.detail}>💰 Fee: {league.joinfee.type} {league.joinfee.amount}</Text>
              <Text style={styles.detail}>🕒 Start: {new Date(league.start).toDateString()}</Text>
              <Text style={styles.detail}>⏳ End: {new Date(league.end).toDateString()}</Text>
              <Text style={styles.detail}>🎮 Type: {league.type}</Text>
              <Text style={styles.detail}>❤️ Lifelines/User: {league.lifelinePerUser}</Text>
              <Text style={styles.detail}>🔁 Repeat Limit: {league.maxTimeTeamSelect}</Text>
              <Text style={styles.detail}>👑 Owner: {league.ownerName}</Text>
              <Text style={styles.detail}>📆 Weeks: {league.totalWeeks}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

export default JoinLeague;

const styles = StyleSheet.create({
  backButtonText: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    fontFamily: "NedianMedium",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  containermain: {
    flex: 1,
    backgroundColor: "#000",
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
    marginTop: 10,
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    marginVertical: 20,
    fontFamily: "NedianMedium",
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
    fontFamily: "NedianMedium",
  },
  detail: {
    fontSize: 14,
    color: "#334155",
    marginBottom: 2,
    fontFamily: "NedianMedium",
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
    fontFamily: "NedianMedium",
  },
  noLeagueText: {
    fontSize: 18,
    color: "#64748b",
    fontFamily: "NedianMedium",
  },
});
