import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Animated,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
  ActivityIndicator,
} from "react-native";
import SearchPopup from "../../src/components/searchIconWithBox";
import { useLeagueStore } from "../../src/store/useLeagueStore";
import { useFonts } from "expo-font";

function MyLeague() {
  const { myleagues, getmyleagues } = useLeagueStore();
  const router = useRouter();

  const [searchVisible, setSearchVisible] = useState(false);

  const [fontsLoaded] = useFonts({
    NedianMedium: require("../../assets/fonts/Nedian-Medium.otf"),
  });

  useEffect(() => {
    getmyleagues();
  }, [getmyleagues]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  const renderLeague = ({ item }) => {
    const scaleValue = new Animated.Value(1);

    const handlePressIn = () => {
      Animated.spring(scaleValue, {
        toValue: 0.96,
        useNativeDriver: true,
      }).start();
    };

    const handlePressOut = () => {
      Animated.spring(scaleValue, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }).start();
    };

    return (
      <Pressable
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        onPress={() =>
          router.push({
            pathname: "/leaguedata",
            params: { league: JSON.stringify(item) },
          })
        }
        style={{ flex: 1 }}
      >
        <Animated.View
          style={[styles.card, { transform: [{ scale: scaleValue }] }]}
        >
          <View style={styles.headerRow}>
            <MaterialIcons name="emoji-events" size={24} color="#6C63FF" />
            <Text style={styles.title}>{item.name}</Text>
          </View>
          <Text style={styles.fee}>
            🏷️ Join Fee: {item.joinfee.type} {item.joinfee.amount}
          </Text>
          <Text style={styles.date}>
            🕒 Start: {new Date(item.start).toDateString()}
          </Text>
          <Text style={styles.date}>
            ⏳ End: {new Date(item.end).toDateString()}
          </Text>
        </Animated.View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      {/* Top Buttons */}
      <View style={styles.topButtons}>
        <Pressable
          style={styles.button}
          onPress={() => router.push("/joinleague")}
        >
          <Text style={styles.buttonText}>Join League</Text>
        </Pressable>

        <Pressable
          style={[styles.button, styles.createButton]}
          onPress={() => router.push("/createleague")}
        >
          <Text style={styles.buttonText}>Create League</Text>
        </Pressable>
      </View>

      {/* Search Button */}
      <Pressable
        style={styles.searchButton}
        onPress={() => setSearchVisible(true)}
      >
        <View style={styles.searchContent}>
          <Text style={styles.searchText}>Search League</Text>
          <MaterialIcons name="search" size={22} color="#000" />
        </View>
      </Pressable>

      {/* League Grid */}
      <FlatList
        data={myleagues}
        keyExtractor={(item) => item._id}
        renderItem={renderLeague}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: "space-between",
          paddingHorizontal: 12,
        }}
        contentContainerStyle={{ paddingBottom: 16 }}
      />

      {/* Search Popup */}
      <SearchPopup
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
      />
    </View>
  );
}

export default MyLeague;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
    paddingTop: 1,
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
  },
  topButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
    marginBottom: 8,
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: "#6C63FF",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    elevation: 2,
  },
  createButton: {
    backgroundColor: "#10B981",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "NedianMedium",
  },
  searchButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: "#fff",
    marginHorizontal: 14,
    marginBottom: 16,
  },
  searchContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  searchText: {
    color: "#000",
    fontWeight: "600",
    fontSize: 16,
    fontFamily: "NedianMedium",
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flex: 1,
    marginHorizontal: 4,
    minHeight: 160,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
    marginLeft: 10,
    flexShrink: 1,
    fontFamily: "NedianMedium",
  },
  fee: {
    fontSize: 14,
    color: "#6B7280",
    marginBottom: 6,
    fontFamily: "NedianMedium",
  },
  date: {
    fontSize: 13,
    color: "#9CA3AF",
    fontFamily: "NedianMedium",
  },
});
