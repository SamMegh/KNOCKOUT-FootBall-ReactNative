import { FontAwesome5, MaterialIcons } from "@expo/vector-icons";
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
import CustomHeader from "../../src/components/customHeader";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useLeagueStore } from "../../src/store/useLeagueStore";
import { useFonts } from "expo-font";

function CreateLeague() {
  const { getmecreatedleagues, myownleagues } = useLeagueStore();
  const router = useRouter();
  const { isAuthUser } = useAuthStore();

  const [fontsLoaded] = useFonts({
    NedianMedium: require("../../assets/fonts/Nedian-Medium.otf"),
  });

  useEffect(() => {
    getmecreatedleagues();
  }, [getmecreatedleagues]);

  if (!fontsLoaded) return null;

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
            params: { league: JSON.stringify(league) },
          })
        }
      >
        <Animated.View style={[styles.card, { transform: [{ scale }] }]}>
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


          </View>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Knockout" subtitle="Manage your leagues easily" />

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>⋞⋞</Text>
      </TouchableOpacity>

      <View style={styles.header}>
        <Text style={styles.heading}>Welcome, Create and manage your leagues!</Text>

        <Pressable
          onPress={() => router.push("/createnewleague")}
          style={styles.createBtn}
        >
          <FontAwesome5 name="plus-circle" size={20} color="#fff" />
          <Text style={styles.createText}>Create New League</Text>
        </Pressable>

        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          {myownleagues.map(renderLeagueCard)}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

export default CreateLeague;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,
    backgroundColor: "#000",
    borderBottomWidth: 1,
    borderRadius: 12,
    elevation: 2,
  },
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  backButtonText: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    // fontFamily: "NedianMedium",
  },
  heading: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    textAlign: "center",
    fontFamily: "NedianMedium",
  },
  createBtn: {
    flexDirection: "row",
    backgroundColor: "#ff4800",
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
    fontFamily: "NedianMedium",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    
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
    fontFamily: "NedianMedium",
  },
  detail: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
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
    borderRadius: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#000',
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
