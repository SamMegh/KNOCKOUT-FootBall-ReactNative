import { useRouter } from "expo-router";
import { useMemo } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
    View,Modal, Pressable
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomHeader from "../../src/components/customHeader";

const typeStyles = {
  credit: {
    color: "#22c55e",
    icon: "add-circle",
    trend: "trending-up",
    label: "Credit",
  },
  spend: {
    color: "#ef4444",
    icon: "remove-circle",
    trend: "trending-down",
    label: "Spend",
  },
  reward: {
    color: "#3b82f6",
    icon: "gift",
    trend: "sparkles",
    label: "Reward",
  },
  refund: {
    color: "#f59e0b",
    icon: "refresh",
    trend: "return-up-back",
    label: "Refund",
  },
};

export default function CoinTransaction() {
  const transactions = [
    {
      _id: "689f231e4a19cfa6d30f53d9",
      amount: 25,
      freeSCoin: 25,
      payAmount: 0,
      type: "credit",
      coinType: "GCoin",
      description: "Purchased 25 Gcoin",
      paymentId: "pi_3RwMQ8LkiNc5CrL60Luovi4I",
      date: "2025-08-15T12:07:58.080+00:00",
    },
    {
      _id: "689f277dedc2b397d223502c",
      amount: 25,
      freeSCoin: 25,
      payAmount: 0,
      type: "reward",
      coinType: "SCoin",
      description: "Daily reward",
      paymentId: "pi_3RwJucLkiNc5CrL60PqUeI77",
      date: "2025-08-15T12:26:37.064+00:00",
    },
  ];
  const router = useRouter();

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, []);

  const renderTransaction = ({ item }) => {
    const style = typeStyles[item.type] || typeStyles.credit;

    return (
      <View
        key={item._id}
        style={[
          styles.transactionCard,
          { borderLeftColor: style.color },
        ]}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <Ionicons name={style.icon} size={24} color={style.color} />
            <Text style={styles.transactionType}>{style.label}</Text>
          </View>
          <Text style={styles.transactionDesc}>{item.description}</Text>
          <Text style={styles.transactionTime}>
            {new Date(item.date).toLocaleDateString("en-IN", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })} • {new Date(item.date).toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            })} • {item.amount} {item.coinType}
          </Text>
        </View>
        <Ionicons name={style.trend} size={22} color={style.color} />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Knockout" subtitle="Track your coin activity" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.headerRow}>
          <Ionicons name="arrow-back" size={24} color="#000" style={styles.backIcon} onPress={()=>router.back()}/>
          <Text style={styles.heading}>🪙 Coin Transactions</Text>
        </View>

        {sortedTransactions.map((item) => renderTransaction({ item }))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 1,
  },
  heading: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "NedianMedium",
    color: "#000",
  },
  transactionCard: {
    flexDirection: "row",
    backgroundColor: "#f9fafb",
    padding: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderLeftWidth: 4,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000",
    marginLeft: 8,
  },
  transactionDesc: {
    color: "#333",
    fontSize: 14,
    marginTop: 2,
  },
  transactionTime: {
    color: "#666",
    fontSize: 13,
    marginTop: 2,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 21,
  },
  backIcon: {
    marginRight: 12,
  },
});