const env = require("dotenv");
env.config({ path: "./.env" });
const express = require("express");
const Stripe = require("stripe");

const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || "";
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || "";
const stripeWebhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";


const app = express();
const port = 3000; //add your port here

//Confirm the API version from your stripe dashboard
const stripe = Stripe(stripeSecretKey, { apiVersion: "2020-08-27" });

app.listen(port, () => {
  console.log(`Example app listening at ${port}`);
});

app.post("/create-payment-intent", async (req, res) => {
  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1099, //lowest denomination of particular currency
      currency: "usd",
      payment_method_types: ["card"], //by default
    });

    const clientSecret = paymentIntent.client_secret;

    res.json({
      clientSecret: clientSecret,
    });
  } catch (e) {
    console.log(e.message);
    res.json({ error: e.message });
  }
});
