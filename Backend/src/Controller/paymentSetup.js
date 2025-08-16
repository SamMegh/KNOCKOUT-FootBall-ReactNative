import { readFile } from 'fs/promises';
import Stripe from 'stripe';
import User from '../DBmodel/user.db.model.js';
import { getReceiverSocketId, io } from '../lib/socket.config.js';

const stripe = new Stripe(process.env.Secret_key);
const rawData = await readFile(new URL('../CoinData/coinData.json', import.meta.url));
const coinData = JSON.parse(rawData);

export const paymentSheet = async (req, res) => {
  const user = req.user;
  const { id } = req.body;
  const plan = coinData.find(plan => plan.id == id);

  if (!plan) return res.status(400).json({ error: 'Invalid plan' });

  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    { customer: customer.id },
    { apiVersion: '2025-07-30.basil' }
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount:parseInt((plan.usd * 100).toFixed(0), 10),
    currency: 'USD',
    customer: customer.id,
    metadata: {
      userId: user._id.toString(),
      userName: user.name,
      userEmail: user.email,
      userMobile: user.mobile.toString(),
      planId: plan.id,
      planCoinType: plan.coin,
      planCoinAmount: plan.amount
    }
  });

  res.json({
    paymentIntent: paymentIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    publishableKey: process.env.Publishable_key
  });
};

export const stripeWebhook = async (req, res) => {
  let event;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers["stripe-signature"],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    // ✅ Always check if charges exist
    const charge = paymentIntent.charges?.data?.length
      ? paymentIntent.charges.data[0]
      : null;
console.log("charge",charge);
console.log("paymentIntent.charges.data[0]",paymentIntent.charges.data[0]);
console.log("paymentIntent.charges.data",paymentIntent.charges.data);
    const { planId, userId, transactionId } = paymentIntent.metadata;
    const plan = coinData.find((p) => p.id == planId);
    if (!plan) {
      console.warn(`⚠️ Plan ID ${planId} not found`);
      return res.status(400).send("Invalid plan ID");
    }

    // ✅ Extract common identifiers (null if not available)
    const stripePaymentId = paymentIntent.id;     // Stripe PaymentIntent ID
    const stripeChargeId = charge?.id || null;    // Stripe Charge ID
    const utr = charge?.payment_method_details?.upi?.utr || null;
    const vpa = charge?.payment_method_details?.upi?.vpa || null;
    const cardLast4 = charge?.payment_method_details?.card?.last4 || null;

    // ✅ Decide coin increment logic
    const update = {};
    if (plan.coin === "Gcoin") {
      update.GCoin = plan.amount;
      update.SCoin = plan.freeamount;
    } else if (plan.coin === "SCoin") {
      update.SCoin = plan.amount;
    }

    // ✅ Transaction object (refundId optional)
    const transactionObj = {
      type: "credit",
      coinType: plan.coin,
      amount: plan.amount,
      freeSCoin: plan.coin === "Gcoin" ? plan.freeamount : 0,
      description: `Purchased ${plan.amount} ${plan.coin}`,
      paymentId: stripePaymentId,
      chargeId: stripeChargeId,
      utr: utr,
      vpa: vpa,
      cardLast4: cardLast4,
      transactionId: transactionId,
      date: new Date(),
    };

    if (charge?.refunds?.data?.length) {
      transactionObj.refundId = charge.refunds.data[0].id; // ✅ Only add if exists
    }

    // ✅ Update user balance + push transaction
    try {
      const newData_User = await User.findByIdAndUpdate(
        userId,
        { $inc: {
          GCoin:plan.coin === "Gcoin"?plan.amount:0,
          SCoin:plan.coin === "Gcoin"?plan.freeamount:plan.amount
        }, $push: { coinTransactions: transactionObj } },
        { new: true }
      );

      console.log(`✅ Coins credited to user `);

      const receiver = await getReceiverSocketId(userId);
      if (receiver) {
        io.to(receiver).emit("coinsUpdated", {newData_User});
      }
    } catch (err) {
      console.error("❌ DB update failed:", err);
    }
  }

  res.status(200).json({ received: true });
};

