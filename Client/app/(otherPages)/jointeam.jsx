import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuthStore } from "../../src/store/useAuthStore";
import { useLeagueStore } from "../../src/store/useLeagueStore";

export default function JoinTeam() {
  const { isAuthUser } = useAuthStore();
  const { myteam, getmyteam, getDayData, matchOfTheDay, jointeam } =
    useLeagueStore();
  const { id } = useLocalSearchParams();
  const router = useRouter();

  const [showDropDown, setShowDropDown] = useState(false);
  const [loadingTeamData, setLoadingTeamData] = useState(false);
  const [data, setData] = useState({
    day: "",
    teamName: "",
    leagueId: "",
    startTime:"",
  });
  const currentDate= new Date();

  // Fetch team data initially
  useEffect(() => {
    if (id) {
      getmyteam(id);
    }
  }, [id]);

  // Fetch match data for the selected day when dropdown is shown
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

  if (!isAuthUser) return <Redirect href="/" />;

  if (!myteam) {
    return (
      <SafeAreaView>
        <View className="flex-1 justify-center items-center">
          <Text className="text-base">Loading team data...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <TouchableOpacity onPress={() => router.replace("/leaguedata")}>
        <Text className="text-base text-blue-600 mb-4">← Go Back</Text>
      </TouchableOpacity>

      <View className="p-4">
        <Text className="text-lg font-bold mb-2">User: {myteam.userName}</Text>
        <Text className="text-lg font-bold">League: {myteam.leagueName}</Text>
        <Text className="text-lg font-semibold mb-4">
          League ID: {myteam.leagueId}
        </Text>

        <View className="flex-row border-b border-gray-300 pb-2 mb-2">
          <Text className="flex-1 font-bold text-center">Day</Text>
          <Text className="flex-1 font-bold text-center">Team Name</Text>
        </View>

        <FlatList
          data={myteam.teams}
          keyExtractor={(_, index) => index.toString()}
          renderItem={({ item }) => (
            <View className="flex-row py-2 border-b border-gray-200">
              <Text className="flex-1 text-center">
                {new Date(item.day).toDateString()}
              </Text>
              <Text
                className={`flex-1 underline text-center ${new Date() >= new Date(new Date(item.day).getTime() - 15 * 60 * 1000)? "text-gray-500 cursor-not-allowed" : "text-blue-500"}`}
                onPress={() => {
                  if(item.day.slice(0, 10) <= currentDate.toISOString().slice(0, 10))return;
                  setData({
                    day: item.day.split("T")[0],
                    leagueId: myteam.leagueId
                  });
                  setShowDropDown(true);
                }}
              >
                {item.teamName}
              </Text>
            </View>
          )}
        />
      </View>

      {showDropDown && (
        <TouchableWithoutFeedback onPress={() => setShowDropDown(false)}>
          <View className="absolute inset-0 justify-center items-center bg-black bg-opacity-40">
            <TouchableWithoutFeedback>
              <ScrollView className='w-[90%] max-h-[60vh] absolute bg-blue-300 p-4 rounded text-center'>
              <View className="">
                <Text
                  className=" text-right text-xl font-bold text-red-600 mb-2"
                  onPress={() => setShowDropDown(false)}
                >
                  ×
                </Text>

                {loadingTeamData ? (
                  <Text className="text-center">Loading Data...</Text>
                ) : (
                  <FlatList
                    data={matchOfTheDay}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={({ item }) => (
                      <View className="flex-row items-center justify-between bg-slate-200 rounded p-2 m-1">
                        <TouchableOpacity onPress={() => {
                              setShowDropDown(false);
                              jointeam(data.leagueId, data.day, item.home, item.startTime);
                              setData({
                                day: "",
                                teamName: "",
                                leagueId: "",
                              });
                            }}>
                          {/* home team image */}
                          <Image
                            style={styles.tinyLogo}
                            source={{ uri: item.home_png }}
                          />
                          {/* home team */}
                          <Text
                            className="font-bold"
                            
                          >
                            {item.home}
                          </Text>
                        </TouchableOpacity>
                        <Text className="mx-2 font-semibold">Vs</Text>
                        <TouchableOpacity onPress={() => {
                              setShowDropDown(false);
                              jointeam(data.leagueId, data.day, item.away, item.startTime);
                              setData({
                                day: "",
                                teamName: "",
                                leagueId: "",
                              });
                            }}>
                          {/* away team image */}
                          <Image
                            style={styles.tinyLogo}
                            source={{ uri: item.away_png }}
                          />
                          {/* away team */}
                          <Text
                            className="font-bold"
                            
                          >
                            {item.away}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    )}
                  />
                )}
              </View>
              </ScrollView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  tinyLogo: {
    width: 50,
    height: 50,
  },
  logo: {
    width: 66,
    height: 58,
  },
});
