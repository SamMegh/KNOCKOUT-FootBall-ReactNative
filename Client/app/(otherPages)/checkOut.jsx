import { useStripe } from "@stripe/stripe-react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useAuthStore } from "../../src/store/useAuthStore";
import Instance from "../../src/utils/axios.configuration";
import CustomHeader from "../../src/components/customHeader";

export default function CheckoutScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const { isAuthUser, check } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { coinData } = useLocalSearchParams();
  const coinJsonData = JSON.parse(coinData || "{}");

  // Fetch payment sheet params from backend
  const fetchPaymentSheetParams = async () => {
    try {
      const response = await Instance.post("/payment/payment-sheet", {
        id: coinJsonData.id,
      });

      const { paymentIntent, ephemeralKey, customer } = response.data;
      return { paymentIntent, ephemeralKey, customer };
    } catch (error) {
      console.error("Error fetching payment sheet params:", error);
      throw new Error(`Server error: ${error.response?.data || error.message}`);
    }
  };

  // Initialize Stripe Payment Sheet
  const initializePaymentSheet = async () => {
    try {
      const { paymentIntent, ephemeralKey, customer } =
        await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: "KnockOut",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: {
          Id: isAuthUser._id,
          Name: isAuthUser.name,
          Email: isAuthUser.email,
          Mobile: isAuthUser.mobile,
        },
      });

      if (error) {
        console.error("initPaymentSheet error:", error);
        Alert.alert("Error", error.message);
        check();
        router.back();
      } else {
        setLoading(true);
      }
    } catch (err) {
      console.error("Init error:", err);
      Alert.alert("Error", err.message);
      check();
      router.back();
    }
  };

  // Present Stripe Payment Sheet
  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Payment Failed: ${error.code}`, error.message);
      check();
      router.back();
    } else {
      Alert.alert("Success", "Your order is confirmed!");
      check();
      router.back();
    }
  };

  // Confirm before payment
  const handleCheckout = () => {
    Alert.alert(
      "Confirm Purchase",
      `Do you want to buy ${coinJsonData.coin} coins for $${coinJsonData.usd}?`,
      [
        { text: "Cancel", style: "cancel" },
        { text: "Yes", onPress: openPaymentSheet },
      ]
    );
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <SafeAreaView style={styles.containermain}>

      <CustomHeader title="Knockout" subtitle="Manage your leagues easily" />

      {/* Back Button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <Text style={styles.backButtonText}>⋞⋞</Text>
      </TouchableOpacity>
      <View style={styles.container}>

        {/* Coin Details Card */}
        <View style={styles.card}>
          <Text style={styles.title}>{coinJsonData.coin} Coins</Text>

          <View style={styles.detailRow}>
            <Text style={styles.label}>ID:</Text>
            <Text style={styles.value}>{coinJsonData.id}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.label}>Amount:</Text>
            <Text style={styles.value}>{coinJsonData.amount}</Text>

          </View>
          <View style={styles.detailRow}>
            <Text style={styles.label}>Coin :</Text>
            <Text style={styles.value}>{coinJsonData.coin}</Text>
          </View>
          {coinJsonData.freeamount && (
            <View style={styles.detailRow}>
              <Text style={styles.label}>Free Amount:</Text>
              <Text style={styles.value}>{coinJsonData.freeamount}</Text>
            </View>
          )}

          <View style={styles.detailRow}>
            <Text style={styles.label}>USD Price:</Text>
            <Text style={styles.value}>${coinJsonData.usd}</Text>
          </View>
        </View>

        {/* Checkout Button */}
        <TouchableOpacity
          style={[styles.button, !loading && { opacity: 0.6 }]}
          onPress={handleCheckout}
          disabled={!loading}
        >
          <Text style={styles.buttonText}>Proceed to Pay</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backButtonText: {
    marginLeft: 20,
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
  },
  containermain: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 20,

    elevation: 2,
  },
  card: {
    width: "100%",
    backgroundColor: "#1E1E1E",
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  label: {
    fontSize: 16,
    color: "#ccc",
  },
  value: {
    fontSize: 16,
    color: "#fff",
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#FFD700",
    paddingVertical: 15,
    paddingHorizontal: 50,
    borderRadius: 30,
    elevation: 3,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
});
