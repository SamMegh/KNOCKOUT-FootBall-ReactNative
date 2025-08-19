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
          <Text style={styles.detail}>
            💰 Join Fee: {league.joinfee.type} {league.joinfee.amount}
          </Text>
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
    fontFamily: "NedianMedium",
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
    fontFamily: "NedianMedium",
  },
  detail: {
    fontSize: 14,
    color: "#4B5563",
    marginBottom: 4,
    fontFamily: "NedianMedium",
  },
});
