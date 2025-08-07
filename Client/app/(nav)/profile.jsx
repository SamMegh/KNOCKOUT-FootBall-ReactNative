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
        <FormRow label="🧑 First name" value={`${isAuthUser.firstName}`} />
        <FormRow label="👤 Last name" value={`${isAuthUser.lastName}`} />
        <FormRow label="🔐 Username" value={`${isAuthUser.userName}`} valid />
        <FormRow
          label="📛 Display name"
          value={isAuthUser.name ? `${isAuthUser.name}` : " "}
        />
        <FormRow
          label="📱 Mobile number"
          value={isAuthUser.mobile ? `${isAuthUser.mobile}` : "None"}
        />
        <FormRow label="📧 Email" value={isAuthUser.email} />
        <FormRow
          label="🎂 Date of Birth"
          value={isAuthUser.dob ? `${isAuthUser.dob}` : "None"}
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
    flex: 1,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    backgroundColor: "#0f172a",
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
  borderRadius: 40,  // half of width/height
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
    color: "#64748b",
    marginBottom: 6,
    fontSize: 14,
  },
  inputRow: {
    backgroundColor: "#f1f5f9",
    borderRadius: 8,
    padding: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  input: {
    fontSize: 16,
    color: "#0f172a",
  },
  validIcon: {
    fontSize: 18,
    color: "green",
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 24,
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    textAlign: "center",
  },
});
