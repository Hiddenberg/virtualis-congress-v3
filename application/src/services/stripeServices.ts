import type Stripe from "stripe";
import { getOrganizationStripeInstance } from "@/features/organizationPayments/lib/stripe";
import stripe from "@/libs/stripe";

const STRIPE_SUCCESS_URL = process.env.STRIPE_SUCCESS_URL;
const STRIPE_CANCEL_URL = process.env.STRIPE_CANCEL_URL;

if (!STRIPE_SUCCESS_URL) {
   throw new Error("No se encontró la variable de entorno STRIPE_SUCCESS_URL");
}
if (!STRIPE_CANCEL_URL) {
   throw new Error("No se encontró la variable de entorno STRIPE_CANCEL_URL");
}

export async function createSinglePaymentCheckoutSession(priceId: string) {
   const checkoutSession = await stripe.checkout.sessions.create({
      success_url: STRIPE_SUCCESS_URL!,
      cancel_url: STRIPE_CANCEL_URL!,
      line_items: [
         {
            price: priceId,
            quantity: 1,
         },
      ],
      mode: "payment",
      allow_promotion_codes: true,
   });

   return checkoutSession;
}

export async function createBankPaymentCheckoutSession(priceId: string, customerId: string) {
   const customerObject = await stripe.customers.retrieve(customerId);

   if (customerObject.deleted) {
      throw new Error("El usuario ha sido eliminado");
   }

   const checkoutSession = await stripe.checkout.sessions.create({
      success_url: STRIPE_SUCCESS_URL!,
      cancel_url: STRIPE_CANCEL_URL!,
      line_items: [
         {
            price: priceId,
            quantity: 1,
         },
      ],
      customer: customerId,
      mode: "payment",
      allow_promotion_codes: true,
   });

   return checkoutSession;
}

export async function checkPaymentStatus(checkoutSession: string) {
   const paymentSession = await stripe.checkout.sessions.retrieve(checkoutSession);

   return paymentSession.payment_status;
}

export async function createStripeCustomerObject(email: string, fullName: string) {
   const customer = await stripe.customers.create({
      email: email,
      name: fullName,
   });

   return customer;
}

export async function getStripeCustomer(customerId: string) {
   const customer = await stripe.customers.retrieve(customerId);

   return customer;
}

export async function getPaymentMethod(checkoutSession: Stripe.Checkout.Session) {
   if (!checkoutSession.payment_intent) {
      return "";
   }
   const paymentIntent = await stripe.paymentIntents.retrieve(checkoutSession.payment_intent.toString(), {
      expand: ["payment_method"],
   });

   const paymentMethod = paymentIntent.payment_method as Stripe.PaymentMethod;

   return paymentMethod.type;
}

export async function getPaymentIntentStatus(checkoutSession: Stripe.Checkout.Session) {
   const paymentIntentId = checkoutSession.payment_intent?.toString();

   if (!paymentIntentId) {
      return "no payment intent";
   }

   const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
   return paymentIntent.status;
}

export async function createStripePromotionCode(stripeCuponId: string, maxRedemptions: number) {
   const stripe = await getOrganizationStripeInstance();
   const newPromotionCodeObject = await stripe.promotionCodes.create({
      max_redemptions: maxRedemptions,
      promotion: {
         coupon: stripeCuponId,
         type: "coupon",
      },
   });

   return newPromotionCodeObject.code;
}

export async function getPromotionCodesUsed(checkoutSession: Stripe.Checkout.Session) {
   const lineItems = await stripe.checkout.sessions.listLineItems(checkoutSession.id, {
      expand: ["data.discounts"],
   });

   if (!lineItems || lineItems.data.length === 0) {
      throw new Error("No se encontró line items");
   }

   const discountObjects = lineItems.data[0].discounts!;

   const promotionCodesUsed = [];
   for (const discountObject of discountObjects) {
      const promotionCodeId = discountObject.discount.promotion_code;
      if (typeof promotionCodeId === "string" && promotionCodeId) {
         const promotionCodeObject = await stripe.promotionCodes.retrieve(promotionCodeId);

         promotionCodesUsed.push(promotionCodeObject.code);
      }
   }

   console.log("Promotion codes used", promotionCodesUsed);
   return promotionCodesUsed;
}

// export async function fulfillCongressRegistration (checkoutSession: Stripe.Checkout.Session) {
//    console.log(`[Stripe Services] Fulfilling congress registration for checkout session ${checkoutSession.id}`)
//    const customerId = checkoutSession.customer?.toString()
//    if (!customerId) {
//       console.error("No se encontró el customer stripe customer id")
//       return new Response("No se encontró el customer", {
//          status: 400,
//       })
//    }
//    const user = await getStripe(customerId)

//    if (!user) {
//       console.error("No se encontró el usuario ", customerId)
//       return new Response("No se encontró el usuario", {
//          status: 400,
//       })
//    }
//    console.log(`[Stripe Services] User ${user?.id} found by stripe customer id ${customerId}`)

//    // const paymentRegistered = await registerStripePayment(user, checkoutSession)

//    const lineItems = await stripe.checkout.sessions.listLineItems(checkoutSession.id)

//    if (!lineItems || lineItems.data.length === 0) {
//       console.error("No se encontró el price id")
//       return new Response("No se encontró el price id", {
//          status: 400,
//       })
//    }
//    const productId = lineItems.data[0].price?.product.toString()

//    if (!productId) {
//       console.error("No se encontró el product id")
//       return new Response("No se encontró el product id", {
//          status: 400,
//       })
//    }

//    const product = await stripe.products.retrieve(productId);
//    const congressId = product.metadata.congressId

//    if (!congressId) {
//       console.error("No se encontró el congress id")
//       return new Response("No se encontró el congress id", {
//          status: 400,
//       })
//    }

//    const stripePromotionCodesUsed = await getPromotionCodesUsed(checkoutSession)

//    if (stripePromotionCodesUsed.length > 0) {
//       for (const promotionCode of stripePromotionCodesUsed) {
//          await redeemCourtesyInvitationCode(promotionCode, user)
//       }
//    }

//    // await confirmUserRegistrationPayment(user.id, congressId, paymentRegistered.id)
//    await sendPaymentConfirmationEmail(user)
//    console.log("registration payment confirmed")
// }
