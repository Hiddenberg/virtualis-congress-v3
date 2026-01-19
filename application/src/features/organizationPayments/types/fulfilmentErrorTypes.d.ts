interface FulfilmentError {
   organization: OrganizationRecord["id"];
   stripeCheckoutSessionId: string;
   errorMessage: string;
   errorStack: string;
   fixed: boolean;
}
