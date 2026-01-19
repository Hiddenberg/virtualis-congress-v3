interface OrganizationStripeCredentials {
   organization: OrganizationRecord["id"];
   environment: "production" | "development";
   apiKey: string;
   webhookSecret: string;
   successURL: string;
   cancelURL: string;
   returnURL: string;
}
type OrganizationStripeCredentialsRecord =
   DBRecordItem<OrganizationStripeCredentials>;
type NewOrganizationStripeCredentialsData = Omit<
   OrganizationStripeCredentials,
   "organization" | "successURL" | "cancelURL" | "returnURL"
>;

interface UserPayment {
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
}
type UserPaymentRecord = DBRecordItem<UserPayment>;
