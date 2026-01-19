import { Stripe } from "stripe";

const stripeAPIKey = process.env.STRIPE_API_KEY;

if (!stripeAPIKey) {
   throw new Error("Stripe API key not found");
}

const stripe = new Stripe(stripeAPIKey);

export default stripe;
