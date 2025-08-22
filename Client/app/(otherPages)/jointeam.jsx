import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomHeader from "../../src/components/customHeader";
import LoaderCard from "../../src/components/loadingComponent";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useLeagueStore } from "../../src/store/useLeagueStore";

import { useFonts } from "expo-font";

export default function JoinTeam() {
  const { isAuthUser } = useAuthStore();
  const {
    myteam,
    getmyteam,
    isGetMyTeamLoading,
    getDayData,
    isGetDayDataLoading,
    matchOfTheDay,
    jointeam,
    isJoinTeamLoading,
  } = useLeagueStore();

  const { id } = useLocalSearchParams();
  const router = useRouter();

  // Load custom font
  const [fontsLoaded] = useFonts({
    NedianMedium: require("../../assets/fonts/Nedian-Medium.otf"),
  });

  const [showDropDown, setShowDropDown] = useState(false);
  const [loadingTeamData, setLoadingTeamData] = useState(false);
  const [data, setData] = useState({
    day: "",
    teamName: "",
    leagueId: "",
    startTime: "",
  });

  // UTC helper (strip time)
  const getUTCDate = (date) =>
    new Date(
      Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
    );

  const todayUTC = getUTCDate(new Date());

  useEffect(() => {
    if (id) getmyteam(id);
  }, [id]);

  useEffect(() => {
    if (showDropDown && data.day) {
      const fetchData = async () => {
        setLoadingTeamData(true);
        try {
          await getDayData(data.day);
        } catch (error) {
          console.error("Error fetching day data:", error);
        } finally {
          setLoadingTeamData(false);
        }
      };
      fetchData();
    }
  }, [showDropDown, data.day]);

  if (!fontsLoaded) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <LoaderCard />
      </SafeAreaView>
    );
  }

  if (!isAuthUser) return <Redirect href="/" />;

  if (!myteam) {
    return (
      <SafeAreaView>
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text style={[styles.textBase, { color: "white" }]}>
            Loading team data...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (isJoinTeamLoading || isGetMyTeamLoading) {
    return <LoaderCard />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Knockout" subtitle="Manage your leagues easily" />

      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>⋞⋞</Text>
      </TouchableOpacity>

      <View style={styles.containermain}>
        <Text
          style={[styles.textBase, styles.userLeagueText, { marginBottom: 8 }]}
        >
          User: {myteam.userName}
        </Text>
        <Text style={[styles.textBase, styles.userLeagueText]}>
          League: {myteam.leagueName}
        </Text>

        <View style={styles.tableHeader}>
          <Text style={[styles.textBase, styles.headerText]}>Day</Text>
          <Text style={[styles.textBase, styles.headerText]}>Team Name</Text>
        </View>

        <FlatList
          data={myteam.teams}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => {
            const dayUTC = getUTCDate(new Date(item.day));
            const isToday = dayUTC.getTime() === todayUTC.getTime();

            // match start time in UTC
            const matchStart = new Date(item.startTime);
            const now = new Date();

            // user can only select if today AND before match start
            const canSelect = isToday && now < matchStart;

            return (
              <View style={styles.row}>
                <Text style={[styles.textBase, styles.cellText]}>
                  {new Date(item.day).toDateString()}
                </Text>
                <Text
                  style={[
                    styles.ownerName,
                    styles.linkText,
                    !canSelect && styles.disabledText, // disable if not selectable
                  ]}
                  onPress={() => {
                    if (!canSelect) return; // block non-today or after start
                    setData({
                      day: item.day.split("T")[0],
                      leagueId: myteam.leagueId,
                      teamName: item.teamName,
                      startTime: item.startTime,
                    });
                    setShowDropDown(true);
                  }}
                >
                  {item.teamName}
                </Text>
              </View>
            );
          }}
        />
      </View>

      {showDropDown && (
        <TouchableWithoutFeedback onPress={() => setShowDropDown(false)}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback>
              <View style={styles.dropdown}>
                <Text
                  style={[styles.textBase, styles.closeText]}
                  onPress={() => setShowDropDown(false)}
                >
                  ×
                </Text>

                {loadingTeamData ? (
                  <Text style={[styles.textBase, { textAlign: "center" }]}>
                    Loading Data...
                  </Text>
                ) : (
                  <FlatList
                    data={matchOfTheDay}
                    keyExtractor={(_, index) => index.toString()}
                    showsVerticalScrollIndicator={false}
                    renderItem={({ item }) => (
                      <View style={styles.matchRow}>
                        <TouchableOpacity
                          onPress={() => {
                            setShowDropDown(false);
                            jointeam(
                              data.leagueId,
                              data.day,
                              item.home,
                              item.startTime
                            );
                            setData({
                              day: "",
                              teamName: "",
                              leagueId: "",
                              startTime: "",
                            });
                          }}
                        >
                          <Image
                            style={styles.tinyLogo}
                            source={{ uri: item.home_png }}
                          />
                          <Text style={[styles.textBase, styles.matchText]}>
                            {item.home}
                          </Text>
                        </TouchableOpacity>

                        <Text style={[styles.textBase, styles.vsText]}>Vs</Text>

                        <TouchableOpacity
                          onPress={() => {
                            setShowDropDown(false);
                            jointeam(
                              data.leagueId,
                              data.day,
                              item.away,
                              item.startTime
                            );
                            setData({
                              day: "",
                              teamName: "",
                              leagueId: "",
                              startTime: "",
                            });
                          }}
                        >
                          <Image
                            style={styles.tinyLogo}
                            source={{ uri: item.away_png }}
                          />
                          <Text style={[styles.textBase, styles.matchText]}>
                            {item.away}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                )}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
}

const { height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
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
  },
  containermain: {
    marginTop: 10,
    backgroundColor: "#ff4800",
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
  },
  tinyLogo: {
    width: 50,
    height: 50,
    alignSelf: "center",
  },
  textBase: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'NedianMedium',
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
  userLeagueText: {
    borderRadius: 8,
    borderLeftWidth: 1,
    borderLeftColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    color: '#fff',
    marginVertical: 12,
  },
  leagueIdText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  tableHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderColor: "#d1d5db",
    backgroundColor: "#ff4800",
    borderRadius: 8,
    paddingVertical: 4,
    marginBottom: 8,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontWeight: "bold",
    color: "white",
  },
  row: {
    flexDirection: "row",
    paddingVertical: 8,
    paddingHorizontal: 3,
    borderBottomWidth: 1,
    // borderColor: "#e5e7eb",
        backgroundColor: "#ff4800",
    borderRadius: 8,
  },
  cellText: {
    flex: 1,
    color: "white",
  },
  linkText: {
    color: '#ff4800',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'NedianMedium',
    textDecorationLine: "underline",
  },
  disabledText: {
    color: "#9ca3af", // gray-500
  },
  overlay: {
    position: "absolute",
    inset: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  dropdown: {
    width: "95%",
    maxHeight: height * 0.7,
    backgroundColor: "white",
    padding: 16,
    borderRadius: 10,
  },
  closeText: {
    textAlign: "right",
    fontSize: 24,
    fontWeight: "bold",
    color: "#dc2626", // red-600
    marginBottom: 8,
  },
  matchRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "black",
    borderRadius: 8,
    padding: 8,
    marginVertical: 4,
  },
  matchText: {
    width: 112,
    fontWeight: "bold",
    color: "white",
  },
  vsText: {
    marginHorizontal: 8,
    fontWeight: "600",
    color: "white",
  },
});
