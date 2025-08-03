import { load } from "@cashfreepayments/cashfree-js";
import { useEffect, useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import Instance from "../utils/axios.configuration";

function PaymentComponent() {
  const [cashfree, setCashfree] = useState(null);
  const [orderId, setOrderId] = useState("");
const [loading, setLoading] = useState(true);
  // Initialize SDK once when component mounts
useEffect(() => {
  const initSDK = async () => {
    const loadedCashfree = await load({ mode: "sandbox" });
    setCashfree(loadedCashfree);
    setLoading(false); // ✅ SDK is ready
  };
  initSDK();
}, []);

  // Get session ID from backend
  const getSessionId = async () => {
    try {
      const res = await Instance.get("/payment/initiatesession");
      if (res.data && res.data.payment_session_id) {
        setOrderId(res.data.order_id);
        console.log(res.data.order_id);
        return res.data.payment_session_id;
      }
    } catch (error) {
      console.log("Error getting session ID:", error);
    }
  };

  // Verify payment after completion
  const verifyPayment = async () => {
    try {
      
      let res = await Instance.post("/payment/verify", {
        orderId: orderId
      })

      if(res && res.data){
        alert("payment verified")
      }

    } catch (error) {
      console.log(error)
    }
  };

  // Handle payment process
  const handlePayment = async () => {
    try {
      if (!cashfree) {
        alert("Cashfree SDK not loaded yet.");
        return;
      }

      const sessionId = await getSessionId();
      if (!sessionId) return;

      let checkoutOptions = {
        paymentSessionId: sessionId,
        redirectTarget: "_modal", // or "_self", "_blank"
      };

      cashfree.checkout(checkoutOptions).then(() => {
        console.log("✅ Payment initialized");
        verifyPayment(); // Call without argument, orderId is already in state
      });
    } catch (error) {
      console.log("Error during payment:", error);
    }
  };

  return (
    <TouchableOpacity
  onPress={handlePayment}
  disabled={loading}
  style={{
    backgroundColor: loading ? "#ccc" : "white",
    padding: 10,
    margin: 20,
    borderRadius: 10,
    alignItems: "center",
  }}
>
  <Text style={{ fontWeight: "bold" }}>
    {loading ? "Loading SDK..." : "Check Payment Gateway"}
  </Text>
</TouchableOpacity>
  );
}

export default PaymentComponent;
