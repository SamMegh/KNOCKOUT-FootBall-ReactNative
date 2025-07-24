import { Platform, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../../src/store/useAuthStore.js";

export default function Profile() {
  const { isAuthUser, logout } = useAuthStore();

  if (!isAuthUser) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#0f172a",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={{ color: "#f8fafc", fontSize: 18 }}>
          Unable to get user details.
        </Text>
      </View>
    );
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#fff",
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: 24,
      }}
    >
      <View
        style={{
          backgroundColor: "#1e293b",
          borderRadius: 16,
          padding: 24,
          width: Platform.OS === "web" ? "40vw" : "90%",
          maxWidth: 400,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 3,
        }}
      >
        <Text
          style={{
            color: "#f8fafc",
            fontSize: 24,
            fontWeight: "700",
            marginBottom: 16,
            textAlign: "center",
          }}
        >
          👤 Profile
        </Text>

        <Text style={styles.row}>🆔 ID: {isAuthUser._id}</Text>
        <Text style={styles.row}>🧑 Name: {isAuthUser.name}</Text>
        <Text style={styles.row}>📧 Email: {isAuthUser.email}</Text>

        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = {
  row: {
    fontSize: 16,
    color: "#e2e8f0",
    marginBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#334155",
    paddingBottom: 6,
  },
  logoutBtn: {
    marginTop: 24,
    backgroundColor: "#ef4444",
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: "#fff",
    fontWeight: "600",
    textAlign: "center",
    fontSize: 16,
  },
};
