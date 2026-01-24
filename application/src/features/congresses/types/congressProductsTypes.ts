import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import type { ProductPriceRecord } from "./congressProductPricesTypes";
import type { CongressRecord } from "./congressTypes";

export interface CongressProduct {
   organization: OrganizationRecord["id"];
   congress: CongressRecord["id"];
   name: string;
   description?: string;
   stripeProductId: string;
   productType: "congress_online_access" | "congress_in_person_access" | "congress_recordings";
}

export type CongressProductRecord = DBRecordItem<CongressProduct>;

export type NewCongressProductData = Omit<CongressProduct, "organization" | "stripeProductId">;

export interface CongressProductWithPrices {
   product: CongressProductRecord;
   prices: ProductPriceRecord[];
}
