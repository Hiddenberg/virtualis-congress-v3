import { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import { CongressRecord } from "./congressTypes";

export interface CongressPrice {
   organization: OrganizationRecord["id"];
   congress: CongressRecord["id"];
   name: string;
   priceAmount: number;
   currency: "mxn" | "usd";
   accessType: "virtual" | "in-person";
   stripePriceId: string;
   requiresCredentialValidation: boolean;
   credentialValidationInstructions?: string;
}

export type CongressPriceRecord = DBRecordItem<CongressPrice>;
