import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import type { ProductPriceRecord } from "./congressProductPricesTypes";
import type { CongressRecord } from "./congressTypes";

export interface CongressProductPriceCredentialUploaded {
   organization: OrganizationRecord["id"];
   congress: CongressRecord["id"];
   user: UserRecord["id"];
   priceSelected: ProductPriceRecord["id"];
   credentialFile: File | string;
}

export type CongressProductPriceCredentialUploadedRecord = DBRecordItem<CongressProductPriceCredentialUploaded>;

export type NewCongressProductPriceCredentialUploadedData = Omit<CongressProductPriceCredentialUploaded, "organization">;
