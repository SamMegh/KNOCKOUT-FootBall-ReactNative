// components/SearchPopup.jsx
import { MaterialIcons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useLeagueStore } from "../store/useLeagueStore";

const SearchPopup = ({ visible, onClose }) => {
  const [name, setName] = useState("");
  const { 
    leagueSearchResult, 
    leaguebyname, 
    SearchByName, 
    isSearching, 
    sendRequest 
  } = useLeagueStore();

  // ⚡ Fetch initial leagues once on mount
  useEffect(() => {
    leaguebyname();
  }, []);

  // ⚡ Debounce search to avoid spamming API
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (name.trim()) SearchByName(name);
    }, 300);
    return () => clearTimeout(timeout);
  }, [name]);

  // ⚡ Handle user tapping a league
  const handleJoinLeague = (league) => {
    Alert.alert(
      "Join League",
      `Are you sure you want to join ${league.name}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Join",
          onPress: () => {
            sendRequest(league._id);
            setName("")
            onClose(); // optionally close popup after joining
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <BlurView intensity={70} tint="dark" style={styles.blurContainer}>
        <View style={styles.popup}>
          {/* Search Input */}
          <View style={styles.searchRow}>
            <MaterialIcons name="search" size={24} color="gray" />
            <TextInput
              style={styles.input}
              placeholder="Search leagues..."
              placeholderTextColor="gray"
              value={name}
              onChangeText={setName}
              autoFocus
            />
            <TouchableOpacity onPress={()=>{
              setName("");
              onClose();}}>
              <MaterialIcons name="close" size={24} color="red" />
            </TouchableOpacity>
          </View>

          {/* Search Results */}
          {isSearching ? (
            <ActivityIndicator
              size="large"
              color="#6200ee"
              style={{ marginTop: 20 }}
            />
          ) : (
            <FlatList
              data={leagueSearchResult || []}
              keyExtractor={(item) => item._id}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleJoinLeague(item)}>
                  <View style={styles.resultCard}>
                    <Text style={styles.leagueName}>{item.name}</Text>
                    <Text style={styles.leagueInfo}>• {item._id}</Text>
                    <Text style={styles.leagueInfo}>
                      {item.type.toUpperCase()} • {item.ownerName}
                    </Text>
                    <Text style={styles.joinFee}>
                      Fee: {item.joinfee.amount} {item.joinfee.type}
                    </Text>
                  </View>
                </TouchableOpacity>
              )}
              ListEmptyComponent={
                !isSearching && name.length > 0 && (
                  <Text style={styles.noResult}>No results found</Text>
                )
              }
            />
          )}
        </View>
      </BlurView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  blurContainer: { flex: 1, justifyContent: "center", alignItems: "center" },
  popup: {
    width: "90%",
    maxHeight: "70%",
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 16,
    padding: 12,
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#ccc",
    marginBottom: 10,
    paddingHorizontal: 5,
  },
  input: { flex: 1, fontSize: 16, padding: 8, color: "black" },
  resultCard: {
    padding: 12,
    marginVertical: 6,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  leagueName: { fontSize: 18, fontWeight: "600", color: "#333" },
  leagueInfo: { fontSize: 14, color: "gray" },
  joinFee: { fontSize: 14, color: "#6200ee", fontWeight: "500" },
  noResult: { textAlign: "center", padding: 20, color: "gray" },
});

export default SearchPopup;
