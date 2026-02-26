import { IS_DEV_ENVIRONMENT, PLATFORM_BASE_DOMAIN } from "@/data/constants/platformConstants";
import { createDBRecord, deleteDBRecord, getSingleDBRecord, pbFilter } from "@/libs/pbServerClientNew";
import "server-only";
import Stripe from "stripe";
import { getOrganizationFromSubdomain } from "@/features/organizations/services/organizationServices";
import type {
   NewOrganizationStripeCredentialsData,
   OrganizationStripeCredentials,
   OrganizationStripeCredentialsRecord,
} from "../types/organizationStripeCredentialsTypes";
import { decrypt, encrypt } from "../utils/encryptionUtils";

export async function configureOrganizationStripeCredentials(credentials: NewOrganizationStripeCredentialsData) {
   const organization = await getOrganizationFromSubdomain();

   if (!organization) {
      throw new Error("Organization not found");
   }

   let webhookEndpointURL: string | undefined;

   let webhookSecret: string | undefined;
   if (!IS_DEV_ENVIRONMENT) {
      const webhookEndpointURL = `https://${organization.subdomain}.${PLATFORM_BASE_DOMAIN}/api/webhooks/stripe`;
      // Check if the webhook endpoint already exists
      const stripe = new Stripe(credentials.apiKey);
      const stripeWebhookEndpoints = await stripe.webhookEndpoints.list({
         limit: 100,
      });

      const requiredEvents: Stripe.WebhookEndpointCreateParams.EnabledEvent[] = [
         "checkout.session.async_payment_failed",
         "checkout.session.async_payment_succeeded",
         "checkout.session.completed",
         "checkout.session.expired",
      ];

      const existingWebhookEndpoint = stripeWebhookEndpoints.data.find((endpoint) => endpoint.url === webhookEndpointURL);

      if (existingWebhookEndpoint) {
         // Make sure the webhook endpoint is configured with the required events
         await stripe.webhookEndpoints.update(existingWebhookEndpoint.id, {
            enabled_events: requiredEvents,
         });

         // The webhook secrete can not be retrieved from the api, we need to manually configure it
         console.log("[Stripe Credentials] Webhook endpoint already exists, updating with required events");
      } else {
         // If the webhook endpoint does not exist create and configure it
         console.log("[Stripe Credentials] Webhook endpoint does not exist, creating and configuring");
         const newStripeWebhookEndpoint = await stripe.webhookEndpoints.create({
            url: webhookEndpointURL,
            enabled_events: requiredEvents,
            description: "Auto-generated webhook endpoint for virtualis congress payments",
         });

         webhookSecret = newStripeWebhookEndpoint.secret;
      }
   }

   const protocol = credentials.environment === "development" ? "http://" : "https://";
   const encryptedCredentials: OrganizationStripeCredentials = {
      ...credentials,
      organization: organization.id,
      apiKey: encrypt(credentials.apiKey),
      webhookSecret: webhookSecret ? encrypt(webhookSecret) : undefined,
      webhookEndpointURL,
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
      webhookSecret: credentials.webhookSecret ? decrypt(credentials.webhookSecret) : undefined,
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
      webhookSecret: credentials.webhookSecret ? `${credentials.webhookSecret.slice(0, 12)}********` : undefined,
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
