import type { ProductPriceRecord } from "@/features/congresses/types/congressProductPricesTypes";
import type { CongressProductRecord } from "@/features/congresses/types/congressProductsTypes";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";

export interface UserPurchase {
   organization: OrganizationRecord["id"];
   user: UserRecord["id"];
   congress: CongressRecord["id"];
   product: CongressProductRecord["id"];
   price: ProductPriceRecord["id"];
}

export type UserPurchaseRecord = DBRecordItem<UserPurchase>;

export type NewUserPurchase = Omit<UserPurchase, "organization">;
