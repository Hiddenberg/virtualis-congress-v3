import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import "server-only";
import { getCongressProductPriceByStripePriceId } from "@/features/congresses/services/congressProductPricesServices";
import { getCongressProductByStripeProductId } from "@/features/congresses/services/congressProductsServices";
import {
   getCongressRegistrationByUserId,
   updateCongressRegistration,
} from "@/features/congresses/services/congressRegistrationServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { sendPaymentConfirmationEmail } from "@/features/emails/services/emailSendingServices";
import { getUserById } from "@/features/users/services/userServices";
import { createDBRecord, getFullDBRecordsList, getSingleDBRecord, pbFilter, updateDBRecord } from "@/libs/pbServerClientNew";
import type { UserStripeData } from "@/types/congress";
import { getOrganizationStripeInstance } from "../lib/stripe";
import { createUserPurchaseRecord, getUserPurchaseByProductType } from "./userPurchaseServices";

export async function getUserStripeCustomerId(userId: string) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      user = {:userId}
   `,
      {
         organizationId: organization.id,
         userId,
      },
   );
   const userStripeData = await getSingleDBRecord<UserStripeData>("USERS_STRIPE_DATA", filter);

   return userStripeData?.stripeCustomerId ?? null;
}

export async function createUserStripeCustomerId(userId: string) {
   const user = await getUserById(userId);
   if (!user) {
      throw new Error("User not found");
   }

   const stripe = await getOrganizationStripeInstance();

   const stripeCustomer = await stripe.customers.create({
      email: user.email,
      name: user.name,
      metadata: {
         userId,
      },
   });

   await createDBRecord<UserStripeData>("USERS_STRIPE_DATA", {
      organization: user.organization,
      user: userId,
      stripeCustomerId: stripeCustomer.id,
   });

   return stripeCustomer.id;
}

export async function ensuredUserStripeCustomer(userId: string) {
   const stripeCustomerId = await getUserStripeCustomerId(userId);
   if (!stripeCustomerId) {
      return await createUserStripeCustomerId(userId);
   }
   return stripeCustomerId;
}

export async function createUserPaymentRecord(userId: string, checkoutSessionId: string) {
   const organization = await getOrganizationFromSubdomain();

   const userPayment = await createDBRecord<UserPayment>("USER_PAYMENTS", {
      organization: organization.id,
      user: userId,
      stripeCheckoutSessionId: checkoutSessionId,
      fulfilledSuccessfully: false,
      checkoutSessionStatus: "open",
   });

   return userPayment;
}

export async function getUserPaymentRecord(checkoutSessionId: string) {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      stripeCheckoutSessionId = {:checkoutSessionId}
   `,
      {
         organizationId: organization.id,
         checkoutSessionId,
      },
   );

   const userPayment = await getSingleDBRecord<UserPayment>("USER_PAYMENTS", filter);

   return userPayment;
}

export async function updateUserPaymentRecord(userPaymentId: UserPaymentRecord["id"], data: Partial<UserPayment>) {
   const updatedUserPayment = await updateDBRecord<UserPayment>("USER_PAYMENTS", userPaymentId, data);

   return updatedUserPayment;
}

export async function getPaymentMethod(paymentIntentId?: string) {
   const stripe = await getOrganizationStripeInstance();
   if (!paymentIntentId) {
      return "";
   }
   const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
      expand: ["payment_method"],
   });

   const paymentMethod = paymentIntent.payment_method;

   if (!paymentMethod) {
      return "";
   }

   if (typeof paymentMethod === "string") {
      return "";
   }

   return paymentMethod.type ?? "";
}

export async function confirmUserCongressPayment(userId: UserRecord["id"]) {
   const congress = await getLatestCongress();

   const inPersonPurchase = await getUserPurchaseByProductType({
      userId,
      congressId: congress.id,
      productType: "congress_in_person_access",
   });
   const virtualPurchase = await getUserPurchaseByProductType({
      userId,
      congressId: congress.id,
      productType: "congress_online_access",
   });

   if (inPersonPurchase || virtualPurchase) {
      return true;
   }

   return false;
}

// export async function fulfillCongressRegistrationV2(checkoutSessionId: string) {
//    const stripe = await getOrganizationStripeInstance();
//    const organization = await getOrganizationFromSubdomain();
//    const congress = await getLatestCongress();
//    if (!congress) {
//       throw new Error(`[fulfillCongressRegistrationV2] No congress found`);
//    }

//    // TODO: Make this function safe to run multiple times,
//    // even concurrently, with the same session ID

//    // TODO: Make sure fulfillment hasn't already been
//    // performed for this Checkout Session
//    const userPayment = await getUserPaymentRecord(checkoutSessionId);
//    if (!userPayment) {
//       throw new Error(`[fulfillCongressRegistrationV2] User payment record not found for checkout session ${checkoutSessionId}`);
//    }
//    if (userPayment.fulfilledSuccessfully) {
//       console.log(`[fulfillCongressRegistrationV2] User payment already fulfilled for checkout session ${checkoutSessionId}`);
//       return;
//    }

//    const userCongressRegistration = await getCongressRegistrationByUserId(userPayment.user);
//    if (!userCongressRegistration) {
//       throw new Error(`[fulfillCongressRegistrationV2] User congress registration not found for user ${userPayment.user}`);
//    }

//    // Retrieve the Checkout Session from the API with line_items expanded
//    const checkoutSession = await stripe.checkout.sessions.retrieve(checkoutSessionId, {
//       expand: ["line_items", "customer"],
//    });
//    // Check the Checkout Session's payment_status property
//    // to determine if fulfillment should be performed
//    if (checkoutSession.payment_status === "unpaid") {
//       console.log(`[fulfillCongressRegistrationV2] Payment not paid for checkout session ${checkoutSessionId}`);
//       return;
//    }
//    // TODO: Perform fulfillment of the line items
//    const lineItems = checkoutSession.line_items;
//    if (!lineItems) {
//       throw new Error(`[fulfillCongressRegistrationV2] No line items found for checkout session ${checkoutSessionId}`);
//    }

//    // TODO: Create user purchases for the line items
//    for (const item of lineItems.data) {
//       const productId = item.price?.product;
//       const priceId = item.price?.id;
//       if (!productId || !priceId) {
//          console.error(`[fulfillCongressRegistrationV2] No product id or price id found for item ${item.id}`);
//          continue;
//       }

//       if (typeof productId !== "string") {
//          console.error(`[fulfillCongressRegistrationV2] Product id is not a string for item ${item.id}`);
//          continue;
//       }

//       if (typeof priceId !== "string") {
//          console.error(`[fulfillCongressRegistrationV2] Price id is not a string for item ${item.id}`);
//          continue;
//       }

//       await createUserPurchaseRecord({
//          congress: congress.id,
//          user: userPayment.user,
//          product: productId,
//          price: priceId,
//       });
//    }

//    // TODO: Record/save fulfillment status for this
//    // Checkout Session
//    // PENDING: check if this could be removed
//    await updateCongressRegistration(userCongressRegistration.id, {
//       paymentConfirmed: true,
//       payment: userPayment.id,
//    });
//    await updateUserPaymentRecord(userPayment.id, {
//       fulfilledSuccessfully: true,
//       fulfilledAt: new Date().toISOString(),
//       checkoutSessionStatus: checkoutSession.status ?? "open",
//       currency: checkoutSession.currency ?? undefined,
//       totalAmount: checkoutSession.amount_total ?? 0,
//       paymentMethod: await getPaymentMethod(checkoutSession.payment_intent?.toString() ?? undefined),
//       discount: checkoutSession.total_details?.breakdown?.discounts?.reduce((acc, discount) => acc + discount.amount, 0) ?? 0,
//    });

//    await sendPaymentConfirmationEmail(userPayment.user);
// }

export async function fulfillCongressRegistrationV3(checkoutSessionId: string) {
   const stripe = await getOrganizationStripeInstance();
   // const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();
   if (!congress) {
      throw new Error(`[fulfillCongressRegistrationV3] No congress found`);
   }

   // TODO: Make this function safe to run multiple times,
   // even concurrently, with the same session ID

   // TODO: Make sure fulfillment hasn't already been
   // performed for this Checkout Session
   const userPayment = await getUserPaymentRecord(checkoutSessionId);
   if (!userPayment) {
      throw new Error(`[fulfillCongressRegistrationV3] User payment record not found for checkout session ${checkoutSessionId}`);
   }
   if (userPayment.fulfilledSuccessfully) {
      console.log(`[fulfillCongressRegistrationV3] User payment already fulfilled for checkout session ${checkoutSessionId}`);
      return;
   }

   // Retrieve the Checkout Session from the API with line_items expanded
   const checkoutSession = await stripe.checkout.sessions.retrieve(checkoutSessionId, {
      expand: ["line_items", "customer"],
   });
   // Check the Checkout Session's payment_status property
   // to determine if fulfillment should be performed
   if (checkoutSession.payment_status === "unpaid") {
      throw new Error(`[fulfillCongressRegistrationV3] Payment not paid for checkout session ${checkoutSessionId}`);
   }

   // TODO: Perform fulfillment of the line items
   const lineItems = checkoutSession.line_items;
   if (!lineItems) {
      throw new Error(`[fulfillCongressRegistrationV3] No line items found for checkout session ${checkoutSessionId}`);
   }

   // TODO: Create user purchases for the line items
   for (const item of lineItems.data) {
      const stripeProductId = item.price?.product;
      const stripePriceId = item.price?.id;
      if (!stripeProductId) {
         console.error(`[fulfillCongressRegistrationV3] No stripe product id found for item ${item.id}`);
         continue;
      }

      if (!stripePriceId) {
         console.error(`[fulfillCongressRegistrationV3] No price id found for item ${item.id}`);
         continue;
      }

      if (typeof stripeProductId !== "string") {
         console.error(`[fulfillCongressRegistrationV3] Product id is not a string for item ${item.id}`);
         continue;
      }

      if (typeof stripePriceId !== "string") {
         console.error(`[fulfillCongressRegistrationV3] Price id is not a string for item ${item.id}`);
         continue;
      }

      const congressProduct = await getCongressProductByStripeProductId(stripeProductId);
      if (!congressProduct) {
         console.error(`[fulfillCongressRegistrationV3] No congress product found for stripe product id ${stripeProductId}`);
         continue;
      }

      const congressProductPrice = await getCongressProductPriceByStripePriceId(stripePriceId);
      if (!congressProductPrice) {
         console.error(`[fulfillCongressRegistrationV3] No congress product price found for stripe price id ${stripePriceId}`);
         continue;
      }

      await createUserPurchaseRecord({
         congress: congress.id,
         user: userPayment.user,
         product: congressProduct.id,
         price: congressProductPrice.id,
      });
   }

   // TODO: Record/save fulfillment status for this
   // Checkout Session
   // PENDING: check if this could be removed
   const userCongressRegistration = await getCongressRegistrationByUserId(userPayment.user);
   if (!userCongressRegistration) {
      console.error(`[fulfillCongressRegistrationV3] User congress registration not found for user ${userPayment.user}`);
   } else {
      await updateCongressRegistration(userCongressRegistration.id, {
         paymentConfirmed: true,
         payment: userPayment.id,
      });
   }

   await updateUserPaymentRecord(userPayment.id, {
      fulfilledSuccessfully: true,
      fulfilledAt: new Date().toISOString(),
      checkoutSessionStatus: checkoutSession.status ?? "open",
      currency: checkoutSession.currency ?? undefined,
      totalAmount: checkoutSession.amount_total ?? 0,
      paymentMethod: await getPaymentMethod(checkoutSession.payment_intent?.toString() ?? undefined),
      discount: checkoutSession.total_details?.breakdown?.discounts?.reduce((acc, discount) => acc + discount.amount, 0) ?? 0,
   });

   await sendPaymentConfirmationEmail(userPayment.user);
}

export async function getAllOrganizationPayments() {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId}
   `,
      {
         organizationId: organization.id,
      },
   );

   const userPayments = await getFullDBRecordsList<UserPayment>("USER_PAYMENTS", {
      filter,
   });

   return userPayments;
}

export async function getAllOrganizationCompletedPayments() {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      checkoutSessionStatus = {:checkoutSessionStatus}
   `,
      {
         organizationId: organization.id,
         checkoutSessionStatus: "complete",
      },
   );

   const completedPayments = await getFullDBRecordsList<UserPayment>("USER_PAYMENTS", {
      filter,
   });

   return completedPayments;
}

export async function getAllOrganizationCompletedPaymentsWithUsers() {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId} &&
      checkoutSessionStatus = {:checkoutSessionStatus}
   `,
      {
         organizationId: organization.id,
         checkoutSessionStatus: "complete",
      },
   );

   const completedPayments = await getFullDBRecordsList<UserPayment>("USER_PAYMENTS", {
      filter,
      expand: "user",
   });

   return completedPayments;
}
