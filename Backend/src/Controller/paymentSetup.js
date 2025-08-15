import { readFile } from 'fs/promises';
import Stripe from 'stripe';

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