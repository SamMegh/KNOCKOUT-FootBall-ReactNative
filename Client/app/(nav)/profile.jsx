import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAuthStore } from "../../src/store/useAuthStore.js";

export default function Profile() {
  const { isAuthUser, logout } = useAuthStore();

  if (!isAuthUser) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Unable to get user details.</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Profile Emoji */}
      <View style={styles.topHadder}>
        <Text style={styles.profileEmoji}>👨‍💻</Text>
      </View>

      {/* Form */}
      <ScrollView contentContainerStyle={styles.formContainer}>
        <FormRow
          label="📛 Display name"
          value={isAuthUser.name ? `${isAuthUser.name}` : " "}
        />
        <FormRow label="📧 Email" value={isAuthUser.email} />
        <FormRow
          label="📱 Mobile number"
          value={isAuthUser.mobile ? `${isAuthUser.mobile}` : "None"}
        />
        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function FormRow({ label, value, valid = false }) {
  return (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.inputRow}>
        <Text style={styles.input}>{value}</Text>
        {valid && <Text style={styles.validIcon}>✅</Text>}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
    paddingHorizontal: 1,
    paddingTop: 1,
    borderTopEndRadius: 40,
    borderTopStartRadius: 40,
  },
  center: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: "#f8fafc",
    fontSize: 18,
  },
  topHadder: {
    alignItems: "center",
    paddingVertical: 15,
    alignContent: "center",
  },
  profileEmoji: {
    fontSize: 50,
    backgroundColor: "#000",
    color: "#fff",
    width: 80,
    height: 80,
    borderRadius: 40, // half of width/height
    textAlign: "center",
    textAlignVertical: "center", // ✅ for Android (centers emoji)
  },
  formContainer: {
    padding: 20,
    paddingBottom: 60,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: "#fff",
    marginBottom: 6,
    fontSize: 14,
  },
  inputRow: {
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    fontSize: 16,
    color: "#000",
  },
  validIcon: {
    fontSize: 18,
    color: "green",
  },
  logoutBtn: {
    backgroundColor: "red",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 24,
  },
  logoutText: {
    color: "black",
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
});
