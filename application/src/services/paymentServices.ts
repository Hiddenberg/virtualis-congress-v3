import "server-only";
import { RecordModel } from "pocketbase";
import pbServerClient from "@/libs/pbServerClient";
// import Stripe from "stripe";
// import {
//    getPaymentIntentStatus,
//    getPaymentMethod
// } from "./stripeServices";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";
// import { User } from "@/types/congress";

export async function getAllPayments(organizationId: string) {
   const allPaymentsForOrganization = await pbServerClient
      .collection(PB_COLLECTIONS.USER_PAYMENTS)
      .getFullList<UserPayment & RecordModel>({
         filter: `organization.id = "${organizationId}"`,
      });

   return allPaymentsForOrganization;
}

// export async function registerStripePayment (user: User & RecordModel, stripeCheckoutSession: Stripe.Checkout.Session) {
//    console.log(`[Payment Services] Registering stripe payment for user ${user.id}`)
//    const newPayment: UserPayment = {
//       organization: user.organization,
//       user: user.id,
//       totalAmount: stripeCheckoutSession.amount_total ?? 0,
//       discount: stripeCheckoutSession.total_details?.amount_discount ?? 0,
//       currency: stripeCheckoutSession.currency ?? "",
//       stripeCheckoutSessionId: stripeCheckoutSession.id,
//       stripePaymentIntentId: stripeCheckoutSession.payment_intent?.toString() ?? "",
//       paymentMethod: await getPaymentMethod(stripeCheckoutSession),
//       status: await getPaymentIntentStatus(stripeCheckoutSession),
//    }

//    const paymentCreated = await pbServerClient.collection(PB_COLLECTIONS.USER_PAYMENTS)
//       .create<UserPayment & RecordModel>(newPayment)
//    console.log(`[Payment Services] Payment registered: ${paymentCreated.id}`)
//    return paymentCreated
// }
