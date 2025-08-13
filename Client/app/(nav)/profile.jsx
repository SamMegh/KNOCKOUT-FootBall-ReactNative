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
  function CoinBox({ label, value,  }) {
  return (
    <View style={styles.coinBox}>
      <Text style={styles.coinLabel}>{label}</Text>
      <Text style={styles.input}>{value}</Text>
    </View>
  );
}

  return (
    <SafeAreaView style={styles.container}>
      {/* Header with Profile Emoji */}
      <View style={styles.topHeader}>
        <Text style={styles.profileEmoji}>👨‍💻</Text>
      </View>

      {/* Form */}
      <ScrollView contentContainerStyle={styles.formContainer}>
        <FormRow
          label="📛 Display name"
          value={isAuthUser.name ? `${isAuthUser.name}` : " "}
        />

        {/* Coins in the same row */}
        <View style={styles.coinRow}>
          <CoinBox
            label="⚪ SCoin"
            value={isAuthUser.SCoin}
          />
          <CoinBox
            label="🪙 GCoin"
            value={isAuthUser.GCoin}
          />
        </View>

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

function CoinBox({ label, value }) {
  return (
    <View style={styles.coinBox}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.input}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
    flex: 1,
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
  topHeader: {
    alignItems: "center",
    paddingVertical: 15,
  },
  profileEmoji: {
    fontSize: 50,
    backgroundColor: "#000",
    color: "#fff",
    width: 80,
    height: 80,
    borderRadius: 40,
    textAlign: "center",
    textAlignVertical: "center",
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
  coinLabel: {
    fontSize: 14,
    color: "#000", // black label for contrast
    marginBottom: 4,
    textAlign: "center",
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
  coinRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  coinBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 10,
    marginHorizontal: 5,
    alignItems: "center",
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
