import { Cashfree } from "cashfree-pg";
import crypto from "crypto";


Cashfree.XClientId = process.env.CASHFREE_CLIENT_ID;
Cashfree.XClientSecret = process.env.CASHFREE_SECRET_KEY;
Cashfree.XEnvironment = Cashfree.Environment.SANDBOX;

const generateOrderId = async () => {
    const uniqueId = crypto.randomBytes(16).toString("hex");
    const hash = crypto.createHash('sha256');
    hash.update(uniqueId);
    const orderId = hash.digest('hex');
    return orderId.slice(0, 12);
}
export const getsession = async (req, res) => {
    try {
        let request = {
            "order_amount": 1,
            "order_currency": "INR",
            "order_id": await generateOrderId(),
            "customer_details": {
                "customer_id": "123123123123",
                "customer_phone": "0000000000",
                "customer_email": "test0@gmail.com"
            },
        };

       const response= await Cashfree.PGCreateOrder("2023-08-01", request);

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "unable to create session", error: error.message })
    }
}



export const verify = async (req, res) => {
    try {

    } catch (error) {
        res.status(500).json({ message: "unable to verify the payment", error })
    }
}