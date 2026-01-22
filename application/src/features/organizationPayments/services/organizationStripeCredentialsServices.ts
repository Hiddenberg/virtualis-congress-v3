import { PLATFORM_BASE_DOMAIN } from "@/data/constants/platformConstants";
import { createDBRecord, deleteDBRecord, getSingleDBRecord, pbFilter } from "@/libs/pbServerClientNew";
import "server-only";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import { decrypt, encrypt } from "../utils/encryptionUtils";

export async function createOrganizationStripeCredentials(credentials: NewOrganizationStripeCredentialsData) {
   const organization = await getOrganizationFromSubdomain();

   if (!organization) {
      throw new Error("Organization not found");
   }
   const protocol = credentials.environment === "development" ? "http://" : "https://";

   const encryptedCredentials: OrganizationStripeCredentials = {
      ...credentials,
      organization: organization.id,
      apiKey: encrypt(credentials.apiKey),
      webhookSecret: encrypt(credentials.webhookSecret),
      successURL: `${protocol}${organization.subdomain}.${PLATFORM_BASE_DOMAIN}/payment/confirmed`,
      cancelURL: `${protocol}${organization.subdomain}.${PLATFORM_BASE_DOMAIN}/payment/canceled`,
      returnURL: `${protocol}${organization.subdomain}.${PLATFORM_BASE_DOMAIN}/payment/return`,
   };

   const createdCredentials = await createDBRecord<OrganizationStripeCredentials>(
      "ORGANIZATION_STRIPE_CREDENTIALS",
      encryptedCredentials,
   );

   return createdCredentials;
}

export async function getOrganizationStripeCredentials() {
   const organization = await getOrganizationFromSubdomain();

   if (!organization) {
      throw new Error("Organization not found");
   }

   const filter = pbFilter(
      `
      organization = {:organizationId}
   `,
      {
         organizationId: organization.id,
      },
   );
   const credentials = await getSingleDBRecord<OrganizationStripeCredentials>("ORGANIZATION_STRIPE_CREDENTIALS", filter);

   if (!credentials) {
      return null;
   }

   const decryptedCredentials: OrganizationStripeCredentialsRecord = {
      ...credentials,
      apiKey: decrypt(credentials.apiKey),
      webhookSecret: decrypt(credentials.webhookSecret),
   };

   return decryptedCredentials;
}

export async function getBlurredOrganizationStripeCredentials() {
   const credentials = await getOrganizationStripeCredentials();

   if (!credentials) {
      return null;
   }

   const blurredCredentials: OrganizationStripeCredentialsRecord = {
      ...credentials,
      apiKey: `${credentials.apiKey.slice(0, 12)}********`,
      webhookSecret: `${credentials.webhookSecret.slice(0, 12)}********`,
   };

   return blurredCredentials;
}

export async function getOrganizationStripeURLs() {
   const organization = await getOrganizationFromSubdomain();

   const filter = pbFilter(
      `
      organization = {:organizationId}
   `,
      {
         organizationId: organization.id,
      },
   );

   const urls = await getSingleDBRecord<Pick<OrganizationStripeCredentials, "successURL" | "cancelURL" | "returnURL">>(
      "ORGANIZATION_STRIPE_CREDENTIALS",
      filter,
      {
         fields: "successURL, cancelURL, returnURL",
      },
   );

   return urls;
}

export async function deleteOrganizationStripeCredentials(credentialsId: string) {
   await deleteDBRecord("ORGANIZATION_STRIPE_CREDENTIALS", credentialsId);
}
