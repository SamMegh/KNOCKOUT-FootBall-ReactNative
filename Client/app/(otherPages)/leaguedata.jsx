import { useFonts } from "expo-font";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../src/components/customHeader.jsx";
import { useAuthStore } from "../../src/store/useAuthStore.js";
import { useLeagueStore } from "../../src/store/useLeagueStore.js";

function LeagueData() {
  const { league } = useLocalSearchParams();
  const parsedLeague = league ? JSON.parse(league) : null;

  const { isAuthUser, coinUpdates } = useAuthStore();
  const router = useRouter();

  const {
    leagueTeams,
    getleagueteams,
    getmyteam,
    myteam,
    getRequests,
    requests,
    rejectRequest,
    acceptRequest,
  } = useLeagueStore();

  const [activeTab, setActiveTab] = useState("Teams");

  const [fontsLoaded] = useFonts({
    NedianMedium: require("../../assets/fonts/Nedian-Medium.otf"),
  });

  if (!fontsLoaded) return null;
  if (!isAuthUser) return <Redirect href="/" />;

  useEffect(() => {
    if (parsedLeague?._id) {
      getmyteam(parsedLeague._id);
      if(parsedLeague.type=="private")
      {
        getRequests(parsedLeague._id);
      }
      getleagueteams(parsedLeague._id);
    } else {
      router.back();
    }
    coinUpdates();
  }, [parsedLeague?._id]);

  const mergedLeagueData = myteam
    ? [myteam, ...leagueTeams.filter((t) => t.userId !== myteam.userId)]
    : leagueTeams;

  const sortedLeagueData = mergedLeagueData.sort((a, b) =>
    a.userId === isAuthUser._id ? -1 : b.userId === isAuthUser._id ? 1 : 0
  );

  const pendingRequests = requests.filter((r) => r.status === "pending");
  const rejectedRequests = requests.filter((r) => r.status === "reject");
  const totalRequests = pendingRequests.length + rejectedRequests.length;

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Knockout" subtitle="Manage your leagues easily" />

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>⋞⋞</Text>
      </TouchableOpacity>

      {/* Tabs */}
      {parsedLeague?.ownerId === isAuthUser._id && parsedLeague.type === "private" && (
        <View style={styles.tabWrapper}>
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab("Teams")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "Teams" && styles.activeTabText,
                ]}
              >
                Teams
              </Text>
              {activeTab === "Teams" && <View style={styles.underline} />}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.tab}
              onPress={() => setActiveTab("Requests")}
            >
              <View style={styles.tabBadgeWrapper}>
                <Text
                  style={[
                    styles.tabText,
                    activeTab === "Requests" && styles.activeTabText,
                  ]}
                >
                  Requests
                </Text>
                {totalRequests > 0 && (
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{totalRequests}</Text>
                  </View>
                )}
              </View>
              {activeTab === "Requests" && <View style={styles.underline} />}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <ScrollView style={styles.scrollView}>
        {activeTab === "Teams" ? (
          sortedLeagueData.map((user, index) => (
            <TouchableOpacity
              key={index}
              disabled={isAuthUser._id !== user.userId}
              onPress={() => {
                if (isAuthUser._id === user.userId) {
                  router.push({
                    pathname: "/jointeam",
                    params: { id: user.leagueId },
                  });
                }
              }}
              style={[
                styles.teamCard,
                {
                  backgroundColor:
                    isAuthUser._id === user.userId ? "#A4BCFF" : "#CCCCCC",
                },
              ]}
            >
              <Text style={styles.teamTitle}>{user.userName}'s Team</Text>

              {user.teams?.map((team, idx) => (
                <View key={idx} style={{ marginBottom: 4, paddingLeft: 8 }}>
                  <Text style={styles.teamInfo}>
                    * {new Date(team.day).toDateString()} — {team.teamName}
                  </Text>
                </View>
              ))}
            </TouchableOpacity>
          ))
        ) : (
          <View>
            {/* Pending Requests */}
            <Text style={styles.sectionTitle}>
              Pending Requests ({pendingRequests.length})
            </Text>
            {pendingRequests.map((req) => (
              <View key={req._id} style={styles.pendingCard}>
                <View>
                  <Text style={styles.pendingName}>{req.userName}</Text>
                  <Text style={styles.pendingInfo}>UID : {req.userId}</Text>
                  <Text style={styles.pendingStatus}>{req.status}</Text>
                </View>
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    style={styles.acceptButton}
                    onPress={() => acceptRequest(req._id)}
                  >
                    <Text style={styles.buttonText}>Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.rejectButton}
                    onPress={() => rejectRequest(req._id)}
                  >
                    <Text style={styles.buttonText}>Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Rejected Requests */}
            <Text style={styles.rejectedTitle}>
              Rejected Requests ({rejectedRequests.length})
            </Text>
            {rejectedRequests.map((req) => (
              <View key={req._id} style={styles.rejectedCard}>
                <View>
                  <Text style={styles.rejectedName}>{req.userName}</Text>
                  <Text style={styles.rejectedStatus}>{req.status}</Text>
                </View>
                <TouchableOpacity
                  style={styles.acceptButton}
                  onPress={() => acceptRequest(req._id)}
                >
                  <Text style={styles.buttonText}>Accept</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

export default LeagueData;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  backButton: {
    marginTop: 10,
  },
  backButtonText: {
    marginLeft: 20,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    fontFamily: "NedianMedium",
  },
  tabWrapper: {
    marginHorizontal: 32,
    marginTop: 8,
  },
  tabContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    position: "relative",
  },
  tabText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    fontFamily: "NedianMedium",
  },
  activeTabText: {
    color: "#000",
    fontWeight: "700",
    fontFamily: "NedianMedium",
  },
  underline: {
    position: "absolute",
    bottom: 0,
    height: 3,
    width: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 2,
  },
  tabBadgeWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  badge: {
    marginLeft: 6,
    backgroundColor: "red",
    borderRadius: 12,
    minWidth: 22,
    height: 22,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 5,
  },
  badgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "NedianMedium",
  },
  scrollView: {
    paddingHorizontal: 32,
    paddingVertical: 40,
    backgroundColor: "#000",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  teamCard: {
    marginBottom: 16,
    padding: 16,
    borderRadius: 12,
  },
  teamTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#003366",
    marginBottom: 8,
    fontFamily: "NedianMedium",
  },
  teamInfo: {
    fontSize: 12,
    color: "#333",
    fontFamily: "NedianMedium",
  },
  sectionTitle: {
    fontSize: 14,
    color: "#fff",
    fontWeight: "700",
    marginBottom: 12,
    fontFamily: "NedianMedium",
  },
  pendingCard: {
    backgroundColor: "#fff",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  pendingName: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "NedianMedium",
  },
  pendingInfo: {
    fontSize: 12,
    color: "#333",
    fontFamily: "NedianMedium",
  },
  pendingStatus: {
    color: "#666",
    fontFamily: "NedianMedium",
  },
  acceptButton: {
    backgroundColor: "#22C55E",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    marginRight: 8,
  },
  rejectButton: {
    backgroundColor: "#EF4444",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontFamily: "NedianMedium",
  },
  rejectedTitle: {
    fontSize: 18,
    color: "#F87171",
    fontWeight: "700",
    marginTop: 24,
    marginBottom: 12,
    fontFamily: "NedianMedium",
  },
  rejectedCard: {
    backgroundColor: "#FECACA",
    padding: 12,
    marginBottom: 12,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  rejectedName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B91C1C",
    fontFamily: "NedianMedium",
  },
  rejectedStatus: {
    color: "#991B1B",
    fontFamily: "NedianMedium",
  },
});
