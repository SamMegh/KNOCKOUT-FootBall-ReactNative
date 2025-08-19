import { useRouter } from "expo-router";
import { useEffect } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";
import { useFonts } from "expo-font";
import GcoinData from "../../assets/GcoinData.json";
import ScoinData from "../../assets/ScoinData.json";
import { useAuthStore } from "../../src/store/useAuthStore.js";

export default function Profile() {
  const { isAuthUser, logout, coinUpdates } = useAuthStore();
  const router = useRouter();

  const [fontsLoaded] = useFonts({
    NedianMedium: require("../../assets/fonts/Nedian-Medium.otf"),
  });

  useEffect(() => {
    coinUpdates();
  }, [coinUpdates]);

  if (!fontsLoaded) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  if (!isAuthUser) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>Unable to get user details.</Text>
      </View>
    );
  }

  function CoinBox({ label, value }) {
    return (
      <TouchableOpacity
        style={styles.coinBox}
        activeOpacity={0.8}
        onPress={() =>
          router.push({
            pathname: "/coinBuy",
            params: {
              coinData:
                label === "🪙 GCoin"
                  ? JSON.stringify(GcoinData)
                  : JSON.stringify(ScoinData),
            },
          })
        }
      >
        <Text style={styles.coinLabel}>{label}</Text>
        <View style={styles.coinValueRow}>
          <Text style={styles.coinValue}>{value}</Text>
          <Text style={styles.coinAdd}>✚</Text>
        </View>
      </TouchableOpacity>
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topHeader}>
        <Text style={styles.profileEmoji}>👨‍💻</Text>
      </View>

      <ScrollView contentContainerStyle={styles.formContainer} scrollEnabled={false}>
        <FormRow
          label="📛 Display name"
          value={isAuthUser.name || "—"}
        />

        <View style={styles.coinRow}>
          <CoinBox label="⚪ SCoin" value={isAuthUser.SCoin} />
          <CoinBox label="🪙 GCoin" value={isAuthUser.GCoin} />
        </View>

        <FormRow label="📧 Email" value={isAuthUser.email} />
        <FormRow
          label="📱 Mobile number"
          value={isAuthUser.mobile || "Not Provided"}
        />

        <TouchableOpacity
          style={styles.transactionRow}
          onPress={() => router.push("/transection")}
        >
          <Text style={styles.transactionText}>💳 Transactions</Text>
          <Text style={styles.transactionArrow}>›</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={logout} style={styles.logoutBtn}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
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
    fontFamily: "NedianMedium",
  },
  topHeader: {
    alignItems: "center",
    paddingVertical: 20,
  },
  profileEmoji: {
    fontSize: 48,
    backgroundColor: "#1f2937",
    color: "#fff",
    width: 90,
    height: 90,
    borderRadius: 45,
    textAlign: "center",
    textAlignVertical: "center",
    overflow: "hidden",
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
    fontFamily: "NedianMedium",
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
    flex: 1,
    fontFamily: "NedianMedium",
  },
  validIcon: {
    fontSize: 18,
    color: "green",
    marginLeft: 8,
  },
  coinRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  coinBox: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginHorizontal: 5,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  coinLabel: {
    fontSize: 14,
    color: "#6b7280",
    marginBottom: 6,
    fontWeight: "600",
    fontFamily: "NedianMedium",
  },
  coinValueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  coinValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#000",
    fontFamily: "NedianMedium",
  },
  coinAdd: {
    fontSize: 20,
    color: "#10b981",
    fontWeight: "bold",
  },
  transactionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  transactionText: {
    fontSize: 16,
    color: "#111827",
    fontWeight: "600",
    fontFamily: "NedianMedium",
  },
  transactionArrow: {
    fontSize: 22,
    color: "#6b7280",
    fontWeight: "600",
  },
  logoutBtn: {
    backgroundColor: "#ef4444",
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 16,
    alignItems: "center",
  },
  logoutText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "NedianMedium",
  },
});
