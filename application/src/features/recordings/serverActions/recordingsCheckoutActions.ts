"use server";
import { redirect } from "next/navigation";
import { getRecordingsCongressProductPrices } from "@/features/congresses/services/congressProductPricesServices";
import { getOrganizationStripeInstance } from "@/features/organizationPayments/lib/stripe";
import {
   createUserPaymentRecord,
   ensuredUserStripeCustomer,
} from "@/features/organizationPayments/services/organizationPaymentsServices";
import { getOrganizationStripeCredentials } from "@/features/organizationPayments/services/organizationStripeCredentialsServices";
import { getOrganizationBaseUrl } from "@/features/organizations/services/organizationServices";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";

export async function createRecordingsCheckout() {
   const stripe = await getOrganizationStripeInstance();
   const urls = await getOrganizationStripeCredentials();

   if (!urls) {
      throw new Error("No se encontraron las URLs de Stripe para la organización");
   }

   const userId = await getLoggedInUserId();
   if (!userId) {
      throw new Error("User not found");
   }

   const recordingsPrice = await getRecordingsCongressProductPrices();

   if (recordingsPrice.length === 0) {
      throw new Error("[createRecordingsCheckout] No recordings prices found");
   }

   const recordingsStripePriceId = recordingsPrice[0].stripePriceId;

   const organizationBaseURL = await getOrganizationBaseUrl();

   const stripeCustomerId = await ensuredUserStripeCustomer(userId);
   const stripeCheckoutSession = await stripe.checkout.sessions.create({
      success_url: `${organizationBaseURL}/congress-recordings/buy/payment-succeed`,
      cancel_url: `${organizationBaseURL}/congress-recordings/buy/payment-failed`,
      line_items: [
         {
            price: recordingsStripePriceId,
            quantity: 1,
         },
      ],
      mode: "payment",
      allow_promotion_codes: true,
      customer: stripeCustomerId,
      metadata: {
         purchaseType: "recordings_only",
      },
   });

   if (!stripeCheckoutSession.url) {
      throw new Error("No se pudo crear la sesión de Checkout de Stripe");
   }

   await createUserPaymentRecord(userId, stripeCheckoutSession.id);

   redirect(stripeCheckoutSession.url);
}
