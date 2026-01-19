import "server-only";
import {
   GeaStripeProductsDev,
   GeaStripeProductsProd,
} from "@/features/organizations/organizationSpecifics/HGEA/data/HGEAPaymentsData";
import { getOrganizationStripeCredentials } from "./organizationStripeCredentialsServices";

export async function getHGEAStripeProducts() {
   const stripeCredentials = await getOrganizationStripeCredentials();
   if (!stripeCredentials) {
      throw new Error("Stripe credentials not found");
   }
   const HGEAStripeProducts =
      stripeCredentials.environment === "production"
         ? GeaStripeProductsProd
         : GeaStripeProductsDev;
   return HGEAStripeProducts;
}
