"use server";

import { revalidatePath } from "next/cache";
import type Stripe from "stripe";
import { IS_DEV_ENVIRONMENT, PLATFORM_BASE_DOMAIN } from "@/data/constants/platformConstants";
import { getOrganizationStripeInstance } from "@/features/organizationPayments/lib/stripe";
import { ensuredUserStripeCustomer } from "@/features/organizationPayments/services/organizationPaymentsServices";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { getLoggedInUserId } from "@/features/staggeredAuth/services/staggeredAuthServices";
import { generateRandomId } from "@/features/staggeredAuth/utils/passwordsGenerator";
import { dbBatch } from "@/libs/pbServerClientNew";
import { getStripePromotionCodeIdByCode } from "@/services/stripeServices";
import PB_COLLECTIONS from "@/types/constants/pocketbaseCollections";
import { getCongressProductPriceById, getRecordingsCongressProductPrices } from "../services/congressProductPricesServices";
import { createDefaultCongressProducts } from "../services/congressProductsServices";
import { getLatestCongress } from "../services/congressServices";
import type { CongressProductPriceCredentialUploaded } from "../types/congressProductPriceCredentialsUploadedTypes";

export async function createDefaultCongressProductsAction(): Promise<BackendResponse<null>> {
   try {
      const congress = await getLatestCongress();
      await createDefaultCongressProducts(congress.id);

      revalidatePath("/congress-admin/products");
      return {
         success: true,
         data: null,
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }

      return {
         success: false,
         errorMessage: "Error al crear los productos por defecto",
      };
   }
}

export async function obtainPriceStripeCheckoutUrlAction({
   priceId,
   credentialFile,
   includeRecordings,
   promoCode,
}: {
   priceId: string;
   credentialFile?: File;
   includeRecordings: boolean;
   promoCode?: string;
}): Promise<BackendResponse<string>> {
   try {
      const organization = await getOrganizationFromSubdomain();
      const price = await getCongressProductPriceById(priceId);
      const userId = await getLoggedInUserId();
      const congress = await getLatestCongress();

      if (!userId) {
         return {
            success: false,
            errorMessage: "User not found",
         };
      }
      if (!price) {
         return {
            success: false,
            errorMessage: "Price not found",
         };
      }

      if (price.requiresCredentialValidation && !credentialFile) {
         return {
            success: false,
            errorMessage: "Credential file is required",
         };
      }

      const batch = dbBatch();

      if (price.requiresCredentialValidation && credentialFile) {
         const priceCredentialId = generateRandomId();
         batch.collection(PB_COLLECTIONS.CONGRESS_PRODUCT_PRICE_CREDENTIAL_UPLOADEDS).create({
            id: priceCredentialId,
            organization: organization.id,
            congress: congress.id,
            user: userId,
            priceSelected: price.id,
            credentialFile,
         } satisfies CongressProductPriceCredentialUploaded & { id: string });
      }

      // get stripe checkout url
      const stripe = await getOrganizationStripeInstance();
      const stripeCustomerId = await ensuredUserStripeCustomer(userId);

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = [
         {
            price: price.stripePriceId,
            quantity: 1,
         },
      ];

      if (includeRecordings) {
         const recordingsPrices = await getRecordingsCongressProductPrices();

         if (recordingsPrices.length === 0) {
            return {
               success: false,
               errorMessage: "No recordings prices found",
            };
         }

         lineItems.push({
            price: recordingsPrices[0].stripePriceId,
            quantity: 1,
         });
      }

      const protocol = IS_DEV_ENVIRONMENT ? "http://" : "https://";
      const successURL = `${protocol}${organization.subdomain}.${PLATFORM_BASE_DOMAIN}/payment/prices/${priceId}/payment-succeeded`;
      const cancelURL = `${protocol}${organization.subdomain}.${PLATFORM_BASE_DOMAIN}/payment/prices/${priceId}/payment-canceled`;

      let discounts: Stripe.Checkout.SessionCreateParams.Discount[] | undefined;
      if (promoCode?.trim()) {
         const promotionCodeId = await getStripePromotionCodeIdByCode(promoCode.trim());
         if (!promotionCodeId) {
            return {
               success: false,
               errorMessage: "El código de invitación o descuento no es válido o ha expirado",
            };
         }
         discounts = [{ promotion_code: promotionCodeId }];
      }

      const checkoutSessionParams: Stripe.Checkout.SessionCreateParams = {
         customer: stripeCustomerId,
         line_items: lineItems,
         allow_promotion_codes: discounts ? undefined : true,
         discounts: discounts ? discounts : undefined,
         success_url: successURL,
         cancel_url: cancelURL,
         mode: "payment",
      };

      const checkoutSession = await stripe.checkout.sessions.create(checkoutSessionParams);

      if (!checkoutSession.url) {
         return {
            success: false,
            errorMessage: "Checkout session URL not obtained",
         };
      }

      // Create user payment record
      const userPaymentId = generateRandomId();
      batch.collection(PB_COLLECTIONS.USER_PAYMENTS).create({
         id: userPaymentId,
         organization: organization.id,
         user: userId,
         stripeCheckoutSessionId: checkoutSession.id,
         fulfilledSuccessfully: false,
         checkoutSessionStatus: "open",
      } satisfies UserPayment & { id: string });

      await batch.send();

      return {
         success: true,
         data: checkoutSession.url,
      };
   } catch (error) {
      if (error instanceof Error) {
         return {
            success: false,
            errorMessage: error.message,
         };
      }

      return {
         success: false,
         errorMessage: "Error al obtener la URL de checkout de Stripe",
      };
   }
}
