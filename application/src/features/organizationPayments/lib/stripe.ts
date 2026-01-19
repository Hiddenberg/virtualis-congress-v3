import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import "server-only";
import Stripe from "stripe";
import { getOrganizationStripeCredentials } from "../services/organizationStripeCredentialsServices";

export async function getOrganizationStripeInstance() {
   const organization = await getOrganizationFromSubdomain();

   if (!organization) {
      throw new Error("Organization not found");
   }

   const credentials = await getOrganizationStripeCredentials();

   if (!credentials) {
      throw new Error("Stripe credentials not found");
   }

   const stripe = new Stripe(credentials.apiKey);

   return stripe;
}
