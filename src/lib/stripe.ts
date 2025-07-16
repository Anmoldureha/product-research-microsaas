import Stripe from "stripe";
import { env } from "@/env.mjs";

const stripe = new Stripe(env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

interface CreateCheckoutParams {
  orderId: string;
  amount: number; // in paise
  credits: number;
  userId: string;
}

export async function createStripeCheckout({
  orderId,
  amount,
  credits,
  userId,
}: CreateCheckoutParams) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: `ResearchPal Pro - ${credits} Search Credits`,
            description: `Get ${credits} product research credits`,
          },
          unit_amount: amount,
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${env.NEXT_PUBLIC_APP_URL}/payment/success?session_id={CHECKOUT_SESSION_ID}&orderId=${orderId}`,
    cancel_url: `${env.NEXT_PUBLIC_APP_URL}/topup?canceled=true`,
    metadata: {
      orderId,
      userId,
      credits: credits.toString(),
    },
  });

  return session;
}

export async function retrieveStripeSession(sessionId: string) {
  return await stripe.checkout.sessions.retrieve(sessionId);
}

export async function constructWebhookEvent(
  payload: string,
  signature: string
) {
  return stripe.webhooks.constructEvent(
    payload,
    signature,
    env.STRIPE_WEBHOOK_SECRET
  );
}

export { stripe };