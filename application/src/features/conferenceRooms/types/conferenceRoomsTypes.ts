import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";

export interface ConferenceRoom {
   organization: OrganizationRecord["id"];
   congress: CongressRecord["id"];
   name: string;
   description?: string;
   capacity: number;
}

export type ConferenceRoomRecord = DBRecordItem<ConferenceRoom>;
export type NewConferenceRoomData = Omit<ConferenceRoom, "organization">;
