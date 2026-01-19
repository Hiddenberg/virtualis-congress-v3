import { getOrganizationStripeInstance } from "@/features/organizationPayments/lib/stripe";
import { createFulfillmentErrorRecord } from "@/features/organizationPayments/services/fulfillmentErrorLoggerServices";
import {
   fulfillCongressRegistrationV2,
   getUserPaymentRecord,
   updateUserPaymentRecord,
} from "@/features/organizationPayments/services/organizationPaymentsServices";
import { getOrganizationStripeCredentials } from "@/features/organizationPayments/services/organizationStripeCredentialsServices";

export async function POST(request: Request) {
   const credentials = await getOrganizationStripeCredentials();
   if (!credentials) {
      return new Response("Webhook Error: No credentials", {
         status: 400,
      });
   }
   const stripe = await getOrganizationStripeInstance();

   const body = await request.text();

   if (!body) {
      return new Response("Webhook Error: No body", {
         status: 400,
      });
   }

   const signature = request.headers.get("stripe-signature");
   if (!signature) {
      return new Response("Webhook Error: No signature header", {
         status: 400,
      });
   }

   let event;
   try {
      event = stripe.webhooks.constructEvent(
         body,
         signature,
         credentials.webhookSecret,
      );
   } catch (err) {
      // console.log(err)
      if (err instanceof Error) {
         return new Response(`Webhook Error: ${err.message}`, {
            status: 400,
         });
      }
   }

   if (!event) {
      return new Response("Webhook Error: Invalid event", {
         status: 400,
      });
   }

   if (
      event.type === "checkout.session.async_payment_succeeded" ||
      event.type === "checkout.session.completed"
   ) {
      const checkoutSession = event.data.object;

      try {
         await fulfillCongressRegistrationV2(checkoutSession.id);
      } catch (error) {
         console.error(
            `[Webhook] Error fulfilling congress registration: `,
            error,
         );
         if (error instanceof Error) {
            await createFulfillmentErrorRecord({
               stripeCheckoutSessionId: checkoutSession.id,
               errorMessage: error.message,
               errorStack: error.stack ?? "",
            });
         } else {
            await createFulfillmentErrorRecord({
               stripeCheckoutSessionId: checkoutSession.id,
               errorMessage: "Unknown error",
               errorStack: "Unknown error",
            });
         }
      }

      return new Response("OK", {
         status: 200,
      });
   } else if (event.type === "checkout.session.expired") {
      const checkoutSession = event.data.object;
      const userPayment = await getUserPaymentRecord(checkoutSession.id);
      if (!userPayment) {
         console.error(
            `[Webhook] User payment not found for checkout session ${checkoutSession.id}`,
         );
         return new Response("Webhook Error: User payment not found", {
            status: 400,
         });
      }

      await updateUserPaymentRecord(userPayment.id, {
         checkoutSessionStatus: "expired",
      });
   }

   return new Response();
}

export async function GET(request: Request) {
   console.log("GET", request);

   return new Response("hello webhook");
}
