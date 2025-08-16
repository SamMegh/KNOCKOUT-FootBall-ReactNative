import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from "react-native-vector-icons/Ionicons";
import CustomHeader from "../../src/components/customHeader";
import { useLeagueStore } from "../../src/store/useLeagueStore";

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
  const { gettransaction, transactions, istransactionsloading } =
    useLeagueStore();
  const router = useRouter();
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const sortedTransactions = useMemo(() => {
    return [...transactions].sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [transactions]);

  useEffect(() => {
    gettransaction();
  }, [gettransaction]);
  

  const renderTransaction = (item) => {
    const style = typeStyles[item.type] || typeStyles.credit;

    return (
      <TouchableOpacity
        key={item._id}
        onPress={() => {
          console.log(item);
          setSelectedTransaction(item);
          setModalVisible(true);
        }}
      >
        <View
          style={[styles.transactionCard, { borderLeftColor: style.color }]}
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
              })}{" "}
              •{" "}
              {new Date(item.date).toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
              })}{" "}
              • {item.amount}{" "}
              {item.coinType?.charAt(0).toUpperCase() +
                item.coinType?.slice(1).toLowerCase()}
            </Text>
          </View>
          <Ionicons name={style.trend} size={22} color={style.color} />
        </View>
      </TouchableOpacity>
    );
  };

  if (istransactionsloading) {
    return (
      <SafeAreaView style={[styles.container, styles.loaderContainer]}>
        <CustomHeader title="Knockout" subtitle="Track your coin activity" />
        <View style={styles.loaderWrapper}>
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text style={styles.loaderText}>Loading transactions...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomHeader title="Knockout" subtitle="Track your coin activity" />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <View style={styles.headerRow}>
          <Ionicons
            name="arrow-back"
            size={24}
            color="#000"
            style={styles.backIcon}
            onPress={() => router.back()}
          />
          <Text style={styles.heading}>🪙 Coin Transactions</Text>
        </View>

        {sortedTransactions.map((item) => renderTransaction(item))}
      </ScrollView>
      {selectedTransaction && (
        <Modal
          key={selectedTransaction.paymentId}
          visible={modalVisible}
          animationType="slide"
          transparent={true}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>🧾 Transaction Details</Text>
              <Text style={styles.modalItem}>
                Type: {selectedTransaction.type}
              </Text>
              <Text style={styles.modalItem}>
                Coin:{" "}
                {selectedTransaction.coinType?.charAt(0).toUpperCase() +
                  selectedTransaction.coinType?.slice(1).toLowerCase()}
              </Text>
              <Text style={styles.modalItem}>
                No. of Coin: {selectedTransaction.amount}
              </Text>
              {selectedTransaction.freeSCoin && (
                <Text style={styles.modalItem}>
                  No. of free Coin: {selectedTransaction.freeSCoin}
                </Text>
              )}
              <Text style={styles.modalItem}>
                Description: {selectedTransaction.description}
              </Text>
              <Text style={styles.modalItem}>
                Payment ID: {selectedTransaction.paymentId}
              </Text>
              <Text style={styles.modalItem}>
                Date:{" "}
                {new Date(selectedTransaction.date).toLocaleString("en-IN")}
              </Text>

              <Pressable
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: "#fff", fontWeight: "600" }}>Close</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
  },
  loaderWrapper: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loaderText: {
    marginTop: 12,
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },

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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    padding: 20,
    borderRadius: 12,
    width: "85%",
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    color: "#000",
  },
  modalItem: {
    fontSize: 15,
    marginBottom: 6,
    color: "#333",
  },
  closeButton: {
    marginTop: 16,
    backgroundColor: "#000",
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: "center",
  },
});
