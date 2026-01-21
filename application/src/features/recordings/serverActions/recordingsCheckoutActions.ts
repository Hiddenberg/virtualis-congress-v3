"use server";
import { redirect } from "next/navigation";
import { IS_DEV_ENVIRONMENT, PLATFORM_BASE_DOMAIN } from "@/data/constants/platformConstants";
import { getOrganizationStripeInstance } from "@/features/organizationPayments/lib/stripe";
import { getCMIMCCStripeProducts } from "@/features/organizationPayments/services/CMIMCCPaymentServices";
import {
   createUserPaymentRecord,
   ensuredUserStripeCustomer,
} from "@/features/organizationPayments/services/organizationPaymentsServices";
import { getOrganizationStripeCredentials } from "@/features/organizationPayments/services/organizationStripeCredentialsServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";

export async function createRecordingsCheckout() {
   const stripe = await getOrganizationStripeInstance();
   const urls = await getOrganizationStripeCredentials();

   if (!urls) {
      throw new Error("No se encontraron las URLs de Stripe para la organización");
   }

   const organization = await getOrganizationFromSubdomain();
   const protocol = IS_DEV_ENVIRONMENT ? "http://" : "https://";

   const CMIMCCStripeProducts = await getCMIMCCStripeProducts();

   const userId = await getLoggedInUserId();
   if (!userId) {
      throw new Error("User not found");
   }

   const stripeCustomerId = await ensuredUserStripeCustomer(userId);
   const session = await stripe.checkout.sessions.create({
      success_url: `${protocol}${organization.subdomain}.${PLATFORM_BASE_DOMAIN}/congress-recordings/buy/payment-succeed`,
      cancel_url: `${protocol}${organization.subdomain}.${PLATFORM_BASE_DOMAIN}/congress-recordings/buy/payment-failed`,
      line_items: [
         {
            price: CMIMCCStripeProducts["Recordings-Access"].prices.regular.priceId,
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

   if (!session.url) {
      throw new Error("No se pudo crear la sesión de Checkout de Stripe");
   }

   await createUserPaymentRecord(userId, session.id);

   redirect(session.url);
}
