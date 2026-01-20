import { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import { CongressPrice } from "./congressPricesTypes";

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

export type NewCongressPriceData = Omit<
   CongressPrice,
   "organization" | "congress" | "stripePriceId"
>;
