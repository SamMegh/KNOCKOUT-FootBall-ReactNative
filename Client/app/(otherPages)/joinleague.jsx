import { Ionicons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import LoaderCard from "../../src/components/loadingComponent";
import { LinearGradient } from "expo-linear-gradient";
import { useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useFonts } from "expo-font";

import { useLeagueStore } from "../../src/store/useLeagueStore";
import CustomHeader from "../../src/components/customHeader";

const JoinLeague = () => {
  const {
    getleague,
    isGetLeaguesLoading,
    leagues,
    joinleague,
    isJoinLeagueLoading,
    removeLeague,
  } = useLeagueStore();
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
      Alert.alert(
        "Join League",
        `Are you sure you want to join "${league.name}"?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Join", onPress: onConfirm },
        ]
      );
    }
  };

  if (!fontsLoaded) return null;

  if (isJoinLeagueLoading || isGetLeaguesLoading) {
    return <LoaderCard />;
  }

  if (leagues.length === 0) {
    return (
      <View style={styles.container}>
        <CustomHeader title="Knockout" subtitle="Manage your leagues easily" />
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Text style={styles.backButtonText}>⋞⋞</Text>
        </TouchableOpacity>
        <Text
          style={[
            styles.centered,
            { fontFamily: "NedianMedium", fontSize: 16 },
          ]}
        >
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
              <LinearGradient
                colors={['#000000', '#c7adad', '#ff4800']}
                start={{ x: 0.85, y: 0.85 }}
                end={{ x: 0.15, y: 0.15 }}
                key={league._id}
                style={styles.cardContainer}>
                {/* Top Row: League ID + Countdown */}


                <View style={styles.topRow}>
                  <Text style={styles.ownerName}>{league.ownerName}</Text>
                  <View style={styles.countdown}>
                    <Text style={styles.countdownText}>
                      <Text style={styles.timerUnit}>{league.start.split("T")[0]}</Text>
                    </Text>
                    <Text style={styles.countdownText}>
                      <Text style={styles.timerUnit}>{league.end.split("T")[0]}</Text>
                    </Text>
                  </View>
                </View>
                {/* League Logo and Name */}
                <View style={styles.leagueInfo}>
                  <MaterialIcons name="sports-soccer" style={styles.leagueLogo} size={28} color="#000" />
                  <Text style={styles.leagueName} >  {league.name.length > 20 ? league.name.slice(0, 20) + '...' : league.name}</Text>
                </View>

                <Text style={styles.leagueData} >Total Weeks: {league.totalWeeks}</Text>
                <Text style={styles.leagueData} >Team Repeat Limit: {league.maxTimeTeamSelect}</Text>

                {/* Jackpot */}
                <View style={styles.jackpotRow}>
                  <Text style={styles.jackpotAmount}>{league.joinfee.type === "GCoin" ? "🪙" : "⚪"}{league.joinfee.amount}</Text>
                  <Text style={styles.jackpotLabel}>
                    <View style={{ flexDirection: 'row' }}>
                      {Array.from({ length: league.lifelinePerUser }).map((_, index) => (
                        <MaterialIcons key={index} name="favorite" size={16} color="#fff" />
                      ))}
                    </View>
                  </Text>
                </View>
                {/* Play Button */}
                <View
                  style={styles.playButton}
                >
                  <Text style={styles.playButtonText}>{league.type}</Text>
                </View>


              </LinearGradient>
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
  cardContainer: {
    backgroundColor: '#ff4800',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
    position: 'relative',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ownerName: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'NedianMedium',
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  countdown: {
    // backgroundColor: '#000',

  },
  countdownText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  timerUnit: {
    fontSize: 10,
    fontWeight: '400',
    fontFamily: 'NedianMedium',
  },
  leagueInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 16,
  },
  leagueLogo: {
    width: 32,
    height: 32,
    marginRight: 12,
  },
  leagueName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'NedianMedium',
    borderLeftWidth: 1,
    borderLeftColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
  },
  leagueData: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'NedianMedium',
    borderLeftWidth: 1,
    borderLeftColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginTop: 12,
  },
  jackpotRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 20,
  },
  jackpotAmount: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'NedianMedium',
  },
  jackpotLabel: {
    color: '#fff',
    fontSize: 12,
    marginLeft: 6,
    // backgroundColor: '#000',
    borderLeftWidth: 1,
    borderLeftColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  playButton: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 10,
    alignSelf: 'flex-end',
    marginTop: -36,
    fontFamily: 'NedianMedium',
  },
  playButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'NedianMedium',
  },
});
