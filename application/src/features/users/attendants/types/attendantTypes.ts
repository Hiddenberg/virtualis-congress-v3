import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";
import type { UserRecord } from "../../types/userTypes";

// Aditional data
export interface AdditionalData {
   [key: string]: unknown;
}

export interface AttendantData {
   organization: OrganizationRecord["id"];
   user: UserRecord["id"];
   additionalData: AdditionalData;
}
export type AttendantDataRecord = DBRecordItem<AttendantData>;
