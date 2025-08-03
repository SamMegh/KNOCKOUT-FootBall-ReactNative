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
            "order_amount": 1.00,
            "order_currency": "INR",
            "order_id": await generateOrderId(),
            "customer_details": {
                "customer_id": "webcodder01",
                "customer_phone": "9999999999",
                "customer_name": "Web Codder",
                "customer_email": "webcodder@example.com"
            },
    };
        const response = await Cashfree.PGCreateOrder("2023-08-01", request);

        res.status(200).json(response.data);
    } catch (error) {
        res.status(500).json({ message: "unable to create session", error: error.message })
    }
}

export const verify = async (req, res) => {
  try {

        let {
            orderId
        } = req.body;

        const response=await Cashfree.PGFetchOrder("2023-08-01", orderId);
        res(200).json(response.data);


    } catch (error) {
        console.log(error);
    }
};