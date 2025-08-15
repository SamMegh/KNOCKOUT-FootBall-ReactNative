import { readFile } from 'fs/promises';
import Stripe from 'stripe';
import User from '../DBmodel/user.db.model.js';

const rawData = await readFile(new URL('../CoinData/coinData.json', import.meta.url));
const coinData = JSON.parse(rawData);


const stripe = new Stripe(process.env.Secret_key);

// This example sets up an endpoint using the Express framework.

export const paymentSheet=async (req, res) => {
  // Use an existing Customer ID if this is a returning customer.
  const user= req.user;
  const {id} = req.body;
  const plan = coinData.find((plan)=>plan.id==id);
   if (!plan) {
    return res.status(400).json({ error: "Invalid plan" });
  }
  const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2025-07-30.basil'}
  );
  const paymentIntent = await stripe.paymentIntents.create({
    amount: plan.usd*100,
    currency: 'USD',
    customer: customer.id,
    // In the latest version of the API, specifying the `automatic_payment_methods` parameter
    // is optional because Stripe enables its functionality by default.
    metadata: {
      userId: (user._id).toString(),
      userName: user.name,
      userEmail: user.email,
      userMobile: (user.mobile).toString(),
      planId: plan.id,
      planCoinType: plan.coin,
      planCoinAmount: plan.amount,
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
  console.log("webhookcalled")
  // const authUser= req.user;
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook error: ${err.message}`);
  }

  // Listen for successful payments
  if (event.type === "payment_intent.succeeded") {
    const paymentIntent = event.data.object;

    const userId = paymentIntent.metadata.userId;
    const planId = paymentIntent.metadata.planId;

    // Find coin amount from your coinData.json
    const plan = coinData.find((p) => p.id == planId);
    if (!plan) return;

    // Update user’s coin balance
    await User.findByIdAndUpdate(userId, { 
      $inc: { 
        GCoin: plan.amount||0,
        SCoin: plan.coins=="Scoin"?plan.amount:plan.freeamount
      },
      $push: {
      coinHistory: {
        type: "credit", // or "debit"
        coinType: plan.coins === "Scoin" ? "Scoin" : "Gcoin",
        amount: plan.amount,
        freeSCoin: plan.coins === "Scoin" ? 0 : plan.freeamount,
        description: `Purchased ${plan.amount} ${plan.coins}`, 
        paymentId:paymentIntent.id,
        date: new Date()
      }
    }
    });

    console.log(`✅ Coins added for user ${userId}`);
  }

  res.json({ received: true });
};
