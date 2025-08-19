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
  const { leagueTeams, getleagueteams, getmyteam, myteam, getRequests, requests, rejectRequest, acceptRequest } = useLeagueStore();

  const [activeTab, setActiveTab] = useState("Teams");

  if (!isAuthUser) return <Redirect href="/" />;

  useEffect(() => {
    if (parsedLeague?._id) {
      getmyteam(parsedLeague._id);
      getRequests(parsedLeague._id);
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
    <SafeAreaView className="flex-1 bg-white">
      <CustomHeader title="Knockout" subtitle="Manage your leagues easily" />

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>⋞⋞</Text>
      </TouchableOpacity>

      {/* Tabs */}
      {parsedLeague?.ownerId === isAuthUser._id &&parsedLeague.type==="private" && (
        <View className="mx-8 mt-2">
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
              <View className="flex-row items-center">
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

      <ScrollView className="px-8 py-10 bg-black rounded-t-[40px]">
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
              className="mb-4 p-4 rounded-xl boxShadow"
              style={{
                backgroundColor:
                  isAuthUser._id === user.userId ? "#A4BCFF" : "#CCCCCC",
              }}
            >
              <Text className="text-xl font-semibold text-blue-700 mb-2">
                {user.userName}'s Team
              </Text>

              {user.teams?.map((team, idx) => (
                <View key={idx} className="mb-1 pl-2">
                  <Text className="text-sm text-gray-800">
                    * {new Date(team.day).toDateString()} — {team.teamName}
                  </Text>
                </View>
              ))}
            </TouchableOpacity>
          ))
        ) : (
          <View>
            {/* Pending Requests */}
            <Text className="text-lg text-white font-bold mb-3">
              Pending Requests ({pendingRequests.length>0?pendingRequests.length:""})
            </Text>
            {pendingRequests.map((req) => (
              <View
                key={req._id}
                className="bg-white p-3 mb-3 rounded-xl flex-row justify-between items-center"
              >
                <View>
                  <Text className="text-lg font-semibold">{req.userName}</Text>
                  <Text className="text-black text-[12px]">UID : {req.userId}</Text>
                  <Text className="text-gray-600">{req.status}</Text>
                </View>
                <View className="flex-row">
                  <TouchableOpacity className="bg-green-500 px-3 py-1 rounded-lg mr-2" onPress={()=>acceptRequest(req._id)} >
                    <Text className="text-white">Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity className="bg-red-500 px-3 py-1 rounded-lg" onPress={()=>rejectRequest(req._id)}>
                    <Text className="text-white">Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Rejected Requests */}
            <Text className="text-lg text-red-400 font-bold mb-3 mt-6">
              Rejected Requests ({rejectedRequests.length})
            </Text>
            {rejectedRequests.map((req) => (
              <View
                key={req._id}
                className="bg-red-100 p-4 mb-3 rounded-xl flex-row justify-between items-center"
              >
                <View>
                  <Text className="text-lg font-semibold text-red-600">
                    {req.userName}
                  </Text>
                  <Text className="text-red-500">{req.status}</Text>
                </View>
                <TouchableOpacity className="bg-green-500 px-3 py-1 rounded-lg" onPress={()=>acceptRequest(req._id)}>
                  <Text className="text-white">Accept</Text>
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
  backButtonText: {
    marginLeft: 20,
    marginBottom: 10,
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
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
  },
  activeTabText: {
    color: "#000",
    fontWeight: "700",
  },
  underline: {
    position: "absolute",
    bottom: 0,
    height: 3,
    width: "100%",
    backgroundColor: "#007AFF",
    borderRadius: 2,
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
  },
  backButton: {
    marginTop: 10,
  },
});
