import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import "server-only";
import {
   getCongressRegistrationByUserId,
   updateCongressRegistration,
} from "@/features/congresses/services/congressRegistrationServices";
import { getLatestCongress } from "@/features/congresses/services/congressServices";
import { sendPaymentConfirmationEmail } from "@/features/emails/services/emailSendingServices";
import { getUserById } from "@/features/users/services/userServices";
import {
   createDBRecord,
   getFullDBRecordsList,
   getSingleDBRecord,
   pbFilter,
   updateDBRecord,
} from "@/libs/pbServerClientNew";
import { UserStripeData } from "@/types/congress";
import { getOrganizationStripeInstance } from "../lib/stripe";
import { getCMIMCCStripeProducts } from "./CMIMCCPaymentServices";
import { getHGEAStripeProducts } from "./HGEAPaymentServices";
import {
   createUserPurchaseRecord,
   getAllUserPurchases,
} from "./userPurchaseServices";

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
   const userStripeData = await getSingleDBRecord<UserStripeData>(
      "USERS_STRIPE_DATA",
      filter,
   );

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

export async function createUserPaymentRecord(
   userId: string,
   checkoutSessionId: string,
) {
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

   const userPayment = await getSingleDBRecord<UserPayment>(
      "USER_PAYMENTS",
      filter,
   );

   return userPayment;
}

export async function updateUserPaymentRecord(
   userPaymentId: UserPaymentRecord["id"],
   data: Partial<UserPayment>,
) {
   const updatedUserPayment = await updateDBRecord<UserPayment>(
      "USER_PAYMENTS",
      userPaymentId,
      data,
   );

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
   const userPurchases = await getAllUserPurchases({
      userId,
      congressId: congress.id,
   });

   if (userPurchases.length === 0) {
      return false;
   }

   const inPersonPurchase = userPurchases.find(
      (purchase) => purchase.productType === "in-person_congress",
   );
   const virtualPurchase = userPurchases.find(
      (purchase) => purchase.productType === "virtual_congress",
   );

   if (inPersonPurchase || virtualPurchase) {
      return true;
   }

   return false;
}

// export async function fulfillRecordingsOnlyPurchase (checkoutSessionId: string) {
//    const stripe = await getOrganizationStripeInstance()
//    const checkoutSession = await stripe.checkout.sessions.retrieve(checkoutSessionId)
//    if (!checkoutSession) {
//       throw new Error(`[OrganizationPaymentsServices] Checkout session not found for checkout session ${checkoutSessionId}`)
//    }

//    const userPayment = await getUserPaymentRecord(checkoutSessionId)
//    if (!userPayment) {
//       throw new Error(`[OrganizationPaymentsServices] User payment record not found for checkout session ${checkoutSessionId}`)
//    }

//    const congressRegistration = await getCongressRegistrationByUserId(userPayment.user)
//    if (!congressRegistration) {
//       throw new Error(`[OrganizationPaymentsServices] Congress registration not found for user ${userPayment.user}`)
//    }

//    if (userPayment.fulfilledSuccessfully) {
//       console.log(`[OrganizationPaymentsServices] User payment already fulfilled for checkout session ${checkoutSessionId}`)
//       return
//    }

//    // Check the Checkout Session's payment_status property
//    // to determine if fulfillment should be performed
//    if (checkoutSession.payment_status === "unpaid") {
//       console.log(`[OrganizationPaymentsServices] Payment not paid for checkout session ${checkoutSessionId}`)
//       return
//    }
// }

export async function fulfillCongressRegistrationV2(checkoutSessionId: string) {
   const stripe = await getOrganizationStripeInstance();
   const organization = await getOrganizationFromSubdomain();
   const congress = await getLatestCongress();
   if (!congress) {
      throw new Error(`[fulfillCongressRegistrationV2] No congress found`);
   }

   // TODO: Make this function safe to run multiple times,
   // even concurrently, with the same session ID

   // TODO: Make sure fulfillment hasn't already been
   // performed for this Checkout Session
   const userPayment = await getUserPaymentRecord(checkoutSessionId);
   if (!userPayment) {
      throw new Error(
         `[fulfillCongressRegistrationV2] User payment record not found for checkout session ${checkoutSessionId}`,
      );
   }
   if (userPayment.fulfilledSuccessfully) {
      console.log(
         `[fulfillCongressRegistrationV2] User payment already fulfilled for checkout session ${checkoutSessionId}`,
      );
      return;
   }

   const userCongressRegistration = await getCongressRegistrationByUserId(
      userPayment.user,
   );
   if (!userCongressRegistration) {
      throw new Error(
         `[fulfillCongressRegistrationV2] User congress registration not found for user ${userPayment.user}`,
      );
   }

   // Retrieve the Checkout Session from the API with line_items expanded
   const checkoutSession = await stripe.checkout.sessions.retrieve(
      checkoutSessionId,
      {
         expand: ["line_items", "customer"],
      },
   );
   // Check the Checkout Session's payment_status property
   // to determine if fulfillment should be performed
   if (checkoutSession.payment_status === "unpaid") {
      console.log(
         `[fulfillCongressRegistrationV2] Payment not paid for checkout session ${checkoutSessionId}`,
      );
      return;
   }
   // TODO: Perform fulfillment of the line items
   const lineItems = checkoutSession.line_items;
   if (!lineItems) {
      throw new Error(
         `[fulfillCongressRegistrationV2] No line items found for checkout session ${checkoutSessionId}`,
      );
   }

   if (organization.shortID === "HGEA") {
      // for this organization we only have one product, it includes access to the virtual congress and recordings
      const GeaStripeProducts = await getHGEAStripeProducts();
      const congressAndRecordingsProductId =
         GeaStripeProducts["Virtual-Congress"].productId;

      for (const lineItem of lineItems.data) {
         const itemPriceDetails = lineItem.price;
         if (!itemPriceDetails) {
            throw new Error(
               `[fulfillCongressRegistrationV2] No price details found for line item ${lineItem.id}`,
            );
         }

         const lineItemProductId = itemPriceDetails.product;

         if (typeof lineItemProductId !== "string") {
            throw new Error(
               `[fulfillCongressRegistrationV2] Line item product ID is not a string for line item ${lineItem.id}`,
            );
         }

         if (lineItemProductId !== congressAndRecordingsProductId) {
            throw new Error(
               `[fulfillCongressRegistrationV2] Line item product ID ${lineItemProductId} is not the expected product ID ${congressAndRecordingsProductId}`,
            );
         }

         await createUserPurchaseRecord({
            userId: userPayment.user,
            congressId: congress.id,
            productType: "virtual_congress",
         });
         await createUserPurchaseRecord({
            userId: userPayment.user,
            congressId: congress.id,
            productType: "recordings_access",
         });
         await updateCongressRegistration(userCongressRegistration.id, {
            attendanceModality: "virtual",
            hasAccessToRecordings: true,
         });
         console.log(
            `[fulfillCongressRegistrationV2] User purchase registered for organization ${organization.shortID}, user ${userPayment.user} for congress ${congress.id} and product type virtual_congress and recordings_access`,
         );
      }
   } else if (organization.shortID === "CMIMCC") {
      const CMIMCCStripeProducts = await getCMIMCCStripeProducts();
      for (const lineItem of lineItems.data) {
         const itemPriceDetails = lineItem.price;
         if (!itemPriceDetails) {
            throw new Error(
               `[fulfillCongressRegistrationV2] No price details found for line item ${lineItem.id}`,
            );
         }

         const virtualCongressProductId =
            CMIMCCStripeProducts["XXIX-Congress-Virtual"].productId;
         const inPersonCongressProductId =
            CMIMCCStripeProducts["XXIX-Congress-In-Person"].productId;
         const recordingsProductId =
            CMIMCCStripeProducts["Recordings-Access"].productId;

         const lineItemProductId = itemPriceDetails.product;

         if (typeof lineItemProductId !== "string") {
            throw new Error(
               `[fulfillCongressRegistrationV2] Line item product ID is not a string for line item ${lineItem.id}`,
            );
         }

         if (lineItemProductId === virtualCongressProductId) {
            await createUserPurchaseRecord({
               userId: userPayment.user,
               congressId: congress.id,
               productType: "virtual_congress",
            });
            await updateCongressRegistration(userCongressRegistration.id, {
               attendanceModality: "virtual",
            });
         } else if (lineItemProductId === inPersonCongressProductId) {
            await createUserPurchaseRecord({
               userId: userPayment.user,
               congressId: congress.id,
               productType: "in-person_congress",
            });
            await updateCongressRegistration(userCongressRegistration.id, {
               attendanceModality: "in-person",
            });
         } else if (lineItemProductId === recordingsProductId) {
            await createUserPurchaseRecord({
               userId: userPayment.user,
               congressId: congress.id,
               productType: "recordings_access",
            });
            await updateCongressRegistration(userCongressRegistration.id, {
               hasAccessToRecordings: true,
            });
         } else {
            throw new Error(
               `[fulfillCongressRegistrationV2] Unknown line item product ID ${lineItemProductId}`,
            );
         }
      }
   } else if (organization.shortID === "ACP-MX") {
      console.log("[fulfillCongressRegistrationV2] ACP-MX organization found");
      await createUserPurchaseRecord({
         userId: userPayment.user,
         congressId: congress.id,
         productType: "virtual_congress",
      });
      await createUserPurchaseRecord({
         userId: userPayment.user,
         congressId: congress.id,
         productType: "recordings_access",
      });
      await updateCongressRegistration(userCongressRegistration.id, {
         attendanceModality: "virtual",
         hasAccessToRecordings: true,
      });
      console.log(
         `[fulfillCongressRegistrationV2] User purchase registered for organization ${organization.shortID}, user ${userPayment.user} for congress ${congress.id} and product type virtual_congress and recordings_access`,
      );
   } else {
      throw new Error(
         `[fulfillCongressRegistrationV2] Organization ${organization.shortID} not supported`,
      );
   }

   // TODO: Record/save fulfillment status for this
   // Checkout Session
   // PENDING: check if this could be removed
   await updateCongressRegistration(userCongressRegistration.id, {
      paymentConfirmed: true,
      payment: userPayment.id,
   });
   await updateUserPaymentRecord(userPayment.id, {
      fulfilledSuccessfully: true,
      fulfilledAt: new Date().toISOString(),
      checkoutSessionStatus: checkoutSession.status ?? "open",
      currency: checkoutSession.currency ?? undefined,
      totalAmount: checkoutSession.amount_total ?? 0,
      paymentMethod: await getPaymentMethod(
         checkoutSession.payment_intent?.toString() ?? undefined,
      ),
      discount:
         checkoutSession.total_details?.breakdown?.discounts?.reduce(
            (acc, discount) => acc + discount.amount,
            0,
         ) ?? 0,
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

   const userPayments = await getFullDBRecordsList<UserPayment>(
      "USER_PAYMENTS",
      {
         filter,
      },
   );

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

   const completedPayments = await getFullDBRecordsList<UserPayment>(
      "USER_PAYMENTS",
      {
         filter,
      },
   );

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

   const completedPayments = await getFullDBRecordsList<UserPayment>(
      "USER_PAYMENTS",
      {
         filter,
         expand: "user",
      },
   );

   return completedPayments;
}
