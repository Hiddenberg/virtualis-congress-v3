import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { createDBRecord } from "@/libs/pbServerClientNew";
import "server-only";

export async function createFulfillmentErrorRecord({
   stripeCheckoutSessionId,
   errorMessage,
   errorStack,
}: Omit<FulfilmentError, "organization" | "fixed">) {
   const organization = await getOrganizationFromSubdomain();

   const fulfillmentError = await createDBRecord<FulfilmentError>("FULFILLMENT_ERRORS", {
      organization: organization.id,
      stripeCheckoutSessionId,
      errorMessage,
      errorStack,
      fixed: false,
   });

   return fulfillmentError;
}
