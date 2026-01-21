"use server";

import { getLatestCongress } from "@/features/congresses/services/congressServices";
import type { AttendanceModality } from "@/features/congresses/types/congressRegistrationTypes";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { getAttendantData } from "@/features/users/attendants/services/attendantServices";
import type { CMIMCCAdditionalAttendantData } from "@/features/users/attendants/types/CMIMCCAdditionalAttendantDataTypes";
import { getUserById } from "@/features/users/services/userServices";
import { getOrganizationStripeInstance } from "../lib/stripe";
import { getCMIMCCStripeProducts } from "../services/CMIMCCPaymentServices";
import { getHGEAStripeProducts } from "../services/HGEAPaymentServices";
import { createUserPaymentRecord, ensuredUserStripeCustomer } from "../services/organizationPaymentsServices";
import { getOrganizationStripeURLs } from "../services/organizationStripeCredentialsServices";

async function getCMIMCCCongressStripePriceId({
   attendanceModality,
   userMedicalRole,
}: {
   attendanceModality: AttendanceModality;
   userMedicalRole: CMIMCCAdditionalAttendantData["medicalRole"];
}) {
   const CMIMCCStripeProducts = await getCMIMCCStripeProducts();
   if (attendanceModality === "virtual") {
      return CMIMCCStripeProducts["XXIX-Congress-Virtual"].prices.regular.priceId;
   }

   const presentialCongressPrices = CMIMCCStripeProducts["XXIX-Congress-In-Person"].prices;
   const medicalRolePricesMap: Record<CMIMCCAdditionalAttendantData["medicalRole"], string> = {
      specialist: presentialCongressPrices.regular.priceId,
      general: presentialCongressPrices["general-medics"].priceId,
      health_professional: presentialCongressPrices["health-professionals"].priceId,
      "student/resident": presentialCongressPrices["students/residents"].priceId,
   };

   return medicalRolePricesMap[userMedicalRole];
}

export async function getCMIMCCCheckoutLinkAction({
   attendanceModality,
   includeRecordings,
}: {
   attendanceModality: AttendanceModality;
   includeRecordings: boolean;
}): Promise<BackendResponse<{ checkoutLink: string }>> {
   try {
      console.log("getCMIMCCCheckoutLinkAction");
      console.log("attendanceModality", attendanceModality);
      console.log("includeRecordings", includeRecordings);

      const userId = await getLoggedInUserId();
      if (!userId) {
         return {
            success: false,
            errorMessage: "UserId not found",
         };
      }

      const user = await getUserById(userId);
      if (!user) {
         return {
            success: false,
            errorMessage: "User not found",
         };
      }

      const attendantData = await getAttendantData(userId);

      if (!attendantData) {
         return {
            success: false,
            errorMessage: "Attendant data not found",
         };
      }

      const stripe = await getOrganizationStripeInstance();
      console.log("attendantData", attendantData);
      const userMedicalRole = (attendantData.additionalData as unknown as CMIMCCAdditionalAttendantData).medicalRole;

      const stripeCustomerId = await ensuredUserStripeCustomer(userId);

      const congressStripePriceId = await getCMIMCCCongressStripePriceId({
         attendanceModality,
         userMedicalRole,
      });

      console.log("congressStripePriceId", congressStripePriceId);

      const organizationStripeURLs = await getOrganizationStripeURLs();
      if (!organizationStripeURLs) {
         return {
            success: false,
            errorMessage: "Organization stripe URLs not found",
         };
      }

      const CMIMCCStripeProducts = await getCMIMCCStripeProducts();

      const lineItems = [
         {
            price: congressStripePriceId,
            quantity: 1,
         },
      ];

      if (includeRecordings) {
         lineItems.push({
            price: CMIMCCStripeProducts["Recordings-Access"].prices.regular.priceId,
            quantity: 1,
         });
      }

      console.log("lineItems", lineItems);

      const checkoutSession = await stripe.checkout.sessions.create({
         customer: stripeCustomerId,
         line_items: lineItems,
         allow_promotion_codes: true,
         mode: "payment",
         success_url: organizationStripeURLs.successURL,
         cancel_url: organizationStripeURLs.cancelURL,
         metadata: {
            userId,
         },
      });

      if (!checkoutSession.url) {
         return {
            success: false,
            errorMessage: "Checkout session URL not obtained",
         };
      }

      // create user payment record
      await createUserPaymentRecord(userId, checkoutSession.id);

      return {
         success: true,
         data: {
            checkoutLink: checkoutSession.url,
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: `[getCMIMCCCheckoutLinkAction] ${error.message}`,
         };
      }

      return {
         success: false,
         errorMessage: "[getCMIMCCCheckoutLinkAction] An unknown error occurred",
      };
   }
}

export async function getHGEACheckoutLinkAction(): Promise<BackendResponse<{ checkoutLink: string }>> {
   try {
      const userId = await getLoggedInUserId();
      if (!userId) {
         return {
            success: false,
            errorMessage: "UserId not found",
         };
      }

      const stripe = await getOrganizationStripeInstance();
      const stripeCustomerId = await ensuredUserStripeCustomer(userId);
      const organizationStripeURLs = await getOrganizationStripeURLs();
      if (!organizationStripeURLs) {
         return {
            success: false,
            errorMessage: "Organization stripe URLs not found",
         };
      }

      const products = await getHGEAStripeProducts();

      const priceId = products["Virtual-Congress"].prices.regular.priceId;

      const checkoutSession = await stripe.checkout.sessions.create({
         customer: stripeCustomerId,
         line_items: [
            {
               price: priceId,
               quantity: 1,
            },
         ],
         allow_promotion_codes: true,
         mode: "payment",
         success_url: organizationStripeURLs.successURL,
         cancel_url: organizationStripeURLs.cancelURL,
         metadata: {
            userId,
         },
      });

      if (!checkoutSession.url) {
         return {
            success: false,
            errorMessage: "Checkout session URL not obtained",
         };
      }

      await createUserPaymentRecord(userId, checkoutSession.id);

      return {
         success: true,
         data: {
            checkoutLink: checkoutSession.url,
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: `[getHGEACheckoutLinkAction] ${error.message}`,
         };
      }
      return {
         success: false,
         errorMessage: "[getHGEACheckoutLinkAction] An unknown error occurred",
      };
   }
}

export async function getACPDiabetesCheckoutLinkAction({
   priceMXN,
   description,
}: {
   priceMXN: number;
   description?: string;
}): Promise<BackendResponse<{ checkoutLink: string }>> {
   try {
      const userId = await getLoggedInUserId();
      if (!userId) {
         return {
            success: false,
            errorMessage: "UserId not found",
         };
      }

      const stripe = await getOrganizationStripeInstance();
      const stripeCustomerId = await ensuredUserStripeCustomer(userId);
      const organizationStripeURLs = await getOrganizationStripeURLs();
      if (!organizationStripeURLs) {
         return {
            success: false,
            errorMessage: "Organization stripe URLs not found",
         };
      }

      const congress = await getLatestCongress();
      if (!congress) {
         return {
            success: false,
            errorMessage: "Congress not found",
         };
      }

      const checkoutSession = await stripe.checkout.sessions.create({
         customer: stripeCustomerId,
         line_items: [
            {
               price_data: {
                  currency: "MXN",
                  unit_amount: priceMXN * 100,
                  product_data: {
                     name: `Acceso a ${congress.title}`,
                     description: description,
                  },
               },
               quantity: 1,
            },
         ],
         allow_promotion_codes: true,
         mode: "payment",
         success_url: organizationStripeURLs.successURL,
         cancel_url: organizationStripeURLs.cancelURL,
         metadata: {
            userId,
         },
      });

      if (!checkoutSession.url) {
         return {
            success: false,
            errorMessage: "Checkout session URL not obtained",
         };
      }

      await createUserPaymentRecord(userId, checkoutSession.id);

      return {
         success: true,
         data: {
            checkoutLink: checkoutSession.url,
         },
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: `[getACPDiabetesCheckoutLinkAction] ${error.message}`,
         };
      }
      return {
         success: false,
         errorMessage: "[getACPDiabetesCheckoutLinkAction] An unknown error occurred",
      };
   }
}
