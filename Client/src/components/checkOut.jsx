import { useStripe } from "@stripe/stripe-react-native";
import { useEffect, useState } from "react";
import { Alert, Button, View } from "react-native";

export default function CheckoutScreen() {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);
  const amount= 10 ;

  const fetchPaymentSheetParams = async () => {
    const response = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/payment/payment-sheet`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Server error: ${errText}`);
    }

    const { paymentIntent, ephemeralKey, customer } = await response.json();
    return { paymentIntent, ephemeralKey, customer };
  };

  const initializePaymentSheet = async () => {
    try {
      const { paymentIntent, ephemeralKey, customer } =
        await fetchPaymentSheetParams();

      const { error } = await initPaymentSheet({
        merchantDisplayName: "Example, Inc.",
        customerId: customer,
        customerEphemeralKeySecret: ephemeralKey,
        paymentIntentClientSecret: paymentIntent,
        allowsDelayedPaymentMethods: true,
        defaultBillingDetails: { name: "Jane Doe" },
      });

      if (error) {
        console.error("initPaymentSheet error:", error);
        Alert.alert("Error", error.message);
      } else {
        setLoading(true);
      }
    } catch (err) {
      console.error("Init error:", err);
      Alert.alert("Error", err.message);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      Alert.alert(`Error code: ${error.code}`, error.message);
    } else {
      Alert.alert("Success", "Your order is confirmed!");
    }
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  return (
    <View style={{ padding: 20 }}>
      <Button
        disabled={!loading}
        title="Checkout"
        onPress={openPaymentSheet}
      />
    </View>
  );
}
