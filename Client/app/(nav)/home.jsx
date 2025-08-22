import { useFonts } from "expo-font";
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
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import LoaderCard from "../../src/components/loadingComponent";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useLeagueStore } from "../../src/store/useLeagueStore";
import { MaterialIcons } from "@expo/vector-icons";
export default function Home() {
  const [fontsLoaded] = useFonts({
    NedianMedium: require("../../assets/fonts/Nedian-Medium.otf"),
  });

  const router = useRouter();
  const {
    leagues,
    removeLeague,
    getleague,
    isGetLeaguesLoading,
    joinleague,
    isJoinLeagueLoading,
    isLoading,
    myleagues,
    getmyleagues,
    isGetMyLeaguesLoading,
  } = useLeagueStore();
  const { isAuthUser, coinUpdates, loading } = useAuthStore();
  const now = useMemo(() => new Date(), []);

  const tips = [
    "Build your dream team wisely",
    "Check player stats regularly",
    "Join public leagues to win rewards",
    "You can only select team before the match start on the same day"
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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
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
      // style={styles.cardContainer}
      onPress={() =>
        router.push({
          pathname: "/leaguedata",
          params: { league: JSON.stringify(league) },
        })
      }
    >
      <View style={styles.cardContainer}>

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
          <Text style={styles.leagueName}>{league.name}</Text>
        </View>

        {/* Jackpot */}
        <View style={styles.jackpotRow}>
          <Text style={styles.jackpotLabel}>
            <View style={{ flexDirection: 'row' }}>
              {Array.from({ length: league.lifelinePerUser }).map((_, index) => (
                <MaterialIcons key={index} name="favorite" size={16} color="#000" />
              ))}
            </View>
          </Text>
        </View>

        {/* Play Button */}
        <Text style={styles.playButton}>
          <Text style={styles.playButtonText}>{league.type}</Text>
        </Text>
      </View>

    </TouchableOpacity>);

  const renderPublicLeague = ({ item: league }) => (


    <View key={league._id} style={styles.cardContainer}>
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


      {/* Jackpot */}
      <View style={styles.jackpotRow}>
        <Text style={styles.jackpotLabel}>
          <View style={{ flexDirection: 'row' }}>
            {Array.from({ length: league.lifelinePerUser }).map((_, index) => (
              <MaterialIcons key={index} name="favorite" size={16} color="#000" />
            ))}
          </View>
        </Text>
      </View>
      {/* Play Button */}
      <TouchableOpacity
        style={styles.playButton}
        onPress={() => confirmJoin(league)}
      >
        <Text style={styles.playButtonText}>Join</Text>
      </TouchableOpacity>

      <Text style={styles.ownerName}> Joining Fee: {league.joinfee.type} {league.joinfee.amount}</Text>

    </View>
  );
  if (isJoinLeagueLoading || isGetMyLeaguesLoading || isGetLeaguesLoading) {
    return <LoaderCard />;
  }
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
        {isLoading ? (
          <ActivityIndicator size="large" color="#f59e0b" />
        ) : leagues?.length > 0 ? (
          <>
            <FlatList
              data={myleagues.slice(0, 4)}
              renderItem={renderPublicLeague}
              keyExtractor={(item) => item._id}
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
          <Text style={styles.playButtonText}>+ Create New League</Text>
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
  cardContainer: {
    backgroundColor: '#ff4800',
    borderRadius: 16,
    padding: 20,
    marginVertical: 12,
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
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'NedianMedium',
  },
  countdown: {
    backgroundColor: '#000',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
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
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'NedianMedium',
  },
  jackpotRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 20,
    jackpotAmount: {
      color: '#ffffff',
      fontSize: 28,
      fontWeight: '600',
      fontFamily: 'NedianMedium',
    },
  },
  jackpotLabel: {
    color: '#000',
    fontSize: 12,
    marginLeft: 6,
    marginBottom: 4,
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

 
  createButton: {
    marginTop: 20,
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
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
   color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'NedianMedium',
  },
  noLeaguesText: {
    fontStyle: "italic",
    color: "#f59e0b",
    fontFamily: "NedianMedium",
  },
});
