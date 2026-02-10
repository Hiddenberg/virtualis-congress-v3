import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import type { CongressProductRecord } from "./congressProductsTypes";
import type { CongressRecord } from "./congressTypes";

export interface ProductPrice {
   organization: OrganizationRecord["id"];
   congress: CongressRecord["id"];
   product: CongressProductRecord["id"];
   name: string;
   priceAmount: number;
   currency: "mxn" | "usd";
   stripePriceId: string;
   requiresCredentialValidation: boolean;
   credentialValidationInstructions?: string;
   archived: boolean;
   includesRecordings: boolean;
}

export type ProductPriceRecord = DBRecordItem<ProductPrice>;
export type NewProductPriceData = Omit<ProductPrice, "organization" | "congress" | "stripePriceId" | "archived">;
