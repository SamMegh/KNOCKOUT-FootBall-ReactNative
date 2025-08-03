import { useState } from "react";
import { Text, TouchableOpacity } from "react-native";
import Instance from "../utils/axios.configuration";
import { load } from "@cashfreepayments/cashfree-js";

function PaymentComponent() {
  let cashfree;
  let insitialzeSDK = async () => {
    cashfree = await load({
      mode: "sandbox",
    });
  };
  insitialzeSDK();
  const { orderId, setOrderId } = useState("");

  // payment part was here
  const getSessionId = async () => {
    try {
      const res = await Instance.get("/payment/initiatesession");
      if (res.data && res.data.payment_session_id) {
        setOrderId(res.data.order_id);
        return res.data.payment_session_id;
      }
    } catch (error) {
      console.log(error);
    }
  };


  const verifyPayment= async()=>{
    try {
        const res = Instance.post("/payment/verify",{
            orderId
        })
        if(res && res.data){
        alert("payment verified")
      }
    } catch (error) {
        console.log(error);
    }
  }

  const handlePayment = async () => {
    try {
      let sessionId = await getSessionId();
      let checkoutOptions = {
        paymentspaymentSessionId: sessionId,
        redirectTarget: "_modal",
      };
      cashfree.checkout(checkoutOptions).then((res) => {
        console.log("payment initialized")

        verifyPayment(orderId)
      })
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <TouchableOpacity
        onPress={handlePayment}
        style={{
          backgroundColor: "white",
          padding: 5,
          margin: 10,
          borderRadius: 20,
        }}
      >
        <Text>Check Payment GetWay</Text>
      </TouchableOpacity>
    </>
  );
}

export default PaymentComponent;
