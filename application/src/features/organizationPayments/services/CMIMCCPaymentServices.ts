import "server-only";
import {
   stripeProductsDev,
   stripeProductsProd,
} from "@/features/organizations/organizationSpecifics/CMIMCC/data/CMIMCCPaymentsData";
import { getOrganizationStripeCredentials } from "./organizationStripeCredentialsServices";

export async function getCMIMCCStripeProducts() {
   const stripeCredentials = await getOrganizationStripeCredentials();

   if (!stripeCredentials) {
      throw new Error("Stripe credentials not found");
   }

   const CMIMCCStripeProducts =
      stripeCredentials.environment === "production"
         ? stripeProductsProd
         : stripeProductsDev;

   return CMIMCCStripeProducts;
}
