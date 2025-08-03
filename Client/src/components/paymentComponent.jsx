import { Text, TouchableOpacity } from "react-native";
import Instance from "../utils/axios.configuration";


function PaymentComponent() {

    
    
    // payment part was here 
    const handlePayment = async ()=>{
        try {
            const res = await Instance.get("/payment/initiatesession");
      if(res){
        console.log(res)
      }
      console.log("paymentDone");
        } catch (error) {
            console.log(error);
        }
      
    }
  return (
    <>
    <TouchableOpacity onPress={handlePayment} style={{
                  backgroundColor:"white",
                  padding:5,
                  margin:10,
                  borderRadius:20,
                }}>
                  <Text>
                    Check Payment GetWay
                  </Text>
                </TouchableOpacity>
    </>
  )
}

export default PaymentComponent
