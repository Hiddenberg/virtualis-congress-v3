import type { ProductPriceRecord } from "@/features/congresses/types/congressProductPricesTypes";
import type { CongressProductRecord } from "@/features/congresses/types/congressProductsTypes";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import type { UserRecord } from "@/features/users/types/userTypes";

export interface UserPurchase {
   organization: OrganizationRecord["id"];
   user: UserRecord["id"];
   congress: CongressRecord["id"];
   product: CongressProductRecord["id"];
   price: ProductPriceRecord["id"];
   wasCustomPrice?: boolean; // This is used to indicate that the purchase was made with a custom price (manual registration)
}

export type UserPurchaseRecord = DBRecordItem<UserPurchase>;

export type NewUserPurchase = Omit<UserPurchase, "organization">;
