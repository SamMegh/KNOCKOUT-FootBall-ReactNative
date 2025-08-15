import { readFile } from 'fs/promises';
import Stripe from 'stripe';
import User from '../DBmodel/user.db.model.js';

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
    amount: plan.usd * 100,
    currency: 'USD',
    customer: customer.id,
    metadata: {
      userId: user._id.toString(),
      userName: user.name,
      userEmail: user.email,
      userMobile: user.mobile.toString(),
      planId: plan.id,
      planCoinType: plan.coin,
      planCoinAmount: plan.amount,
      transactionId: transactionId
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
      req.headers['stripe-signature'],
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error('❌ Webhook signature verification failed:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'payment_intent.succeeded') {
    const paymentIntent = event.data.object;
    const { planId, userId } = paymentIntent.metadata;

    const plan = coinData.find(p => p.id == planId);
    if (!plan) {
      console.warn(`⚠️ Plan ID ${planId} not found`);
      return res.status(400).send('Invalid plan ID');
    }
    await User.findByIdAndUpdate(userId, {
      $inc: {
        GCoin: plan.coin === 'Gcoin' ? plan.amount : 0,
        SCoin: plan.coin === 'Gcoin' ? plan.freeamount : plan.amount
      },
      $push: {
        coinTransactions: {
          type: 'credit',
          coinType: plan.coin,
          amount: plan.amount,
          freeSCoin: plan.coin === 'Gcoin' ? plan.freeamount : 0,
          description: `Purchased ${plan.amount} ${plan.coin}`,
          paymentId: paymentIntent.id,        // Stripe ID
          transactionId: paymentIntent.metadata.transactionId, // Your ID
          date: new Date()
        }
      }
    });

    console.log(`✅ Coins credited to user ${userId}`);
  }

  res.status(200).json({ received: true });
};