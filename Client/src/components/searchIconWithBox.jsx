import { BlurView } from "expo-blur";
import { useEffect, useState } from "react";
import {
    FlatList,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";

const SearchModal = ({ visible, onClose, data, renderItem, searchKey }) => {
  const [query, setQuery] = useState("");
  const [filtered, setFiltered] = useState([]);

  useEffect(() => {
    if (query.trim() === "") {
      setFiltered([]);
    } else {
      setFiltered(
        data.filter((item) =>
          item[searchKey]?.toLowerCase().includes(query.toLowerCase())
        )
      );
    }
  }, [query, data]);

  const handleClose = () => {
    setQuery("");
    onClose();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <BlurView intensity={80} tint="dark" style={styles.blurContainer}>
        <View style={styles.searchBoxContainer}>
          {/* Fixed input at top */}
          <TextInput
            style={styles.searchInput}
            placeholder="Search..."
            placeholderTextColor="#aaa"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />

          {/* Scrollable results below */}
          <FlatList
            data={filtered}
            keyExtractor={(item, index) => item._id || index.toString()}
            renderItem={renderItem}
            style={{ flex: 1 }}
            ListEmptyComponent={
              query !== "" ? (
                <Text style={styles.noResult}>No results found</Text>
              ) : null
            }
          />

          {/* Close button at bottom */}
          <Pressable style={styles.closeBtn} onPress={handleClose}>
            <Text style={styles.closeText}>Close</Text>
          </Pressable>
        </View>
      </BlurView>
    </Modal>
  );
};

export default SearchModal;

const styles = StyleSheet.create({
  blurContainer: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  searchBoxContainer: {
    backgroundColor: "rgba(0,0,0,0.7)",
    borderRadius: 16,
    padding: 16,
    maxHeight: "80%",
    flex: 1,
  },
  searchInput: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  closeBtn: {
    marginTop: 10,
    alignSelf: "center",
    padding: 10,
  },
  closeText: {
    color: "#fff",
    fontSize: 16,
  },
  noResult: {
    textAlign: "center",
    color: "#ccc",
    marginTop: 20,
  },
});
