import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import type { UserRecord } from "@/features/users/types/userTypes";

export interface OrganizationStripeCredentials {
   organization: OrganizationRecord["id"];
   environment: "production" | "development";
   apiKey: string;
   webhookEndpointURL?: string;
   webhookSecret?: string;
   successURL: string;
   cancelURL: string;
   returnURL: string;
}
export type OrganizationStripeCredentialsRecord = DBRecordItem<OrganizationStripeCredentials>;
export type NewOrganizationStripeCredentialsData = Omit<
   OrganizationStripeCredentials,
   "organization" | "successURL" | "cancelURL" | "returnURL" | "webhookSecret" | "webhookEndpointURL"
>;

export interface UserPayment {
   organization: OrganizationRecord["id"];
   user: UserRecord["id"];
   stripeCheckoutSessionId: string;
   checkoutSessionStatus: "open" | "complete" | "expired";
   fulfilledSuccessfully: boolean;
   fulfilledAt?: string;
   totalAmount?: number;
   discount?: number;
   currency?: string;
   paymentMethod?: string;
   wasCustomPrice?: boolean; // This is used to indicate that the payment was made with a custom price (manual registration)
}
export type UserPaymentRecord = DBRecordItem<UserPayment>;
