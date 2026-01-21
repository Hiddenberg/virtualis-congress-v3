import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import type { ProductPrice } from "./congressProductPricesTypes";

export interface Congress {
   organization: OrganizationRecord["id"];
   title: string;
   startDate: string;
   finishDate: string;
   status: "active" | "finished";
   modality: "online" | "hybrid";
   showEndOfDayMessage: boolean;
   showClosingConferenceBanner: boolean;
}

export type CongressRecord = DBRecordItem<Congress>;

export type NewCongressPriceData = Omit<ProductPrice, "organization" | "congress" | "stripePriceId">;
