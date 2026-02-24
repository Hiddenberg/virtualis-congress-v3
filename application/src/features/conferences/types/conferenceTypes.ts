import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";

export interface CongressConference {
   organization: OrganizationRecord["id"];
   congress: CongressRecord["id"];
   title: string;
   shortDescription?: string;
   startTime: string;
   endTime: string;
   conferenceType: "in-person" | "livestream" | "pre-recorded" | "simulated_livestream" | "break";
   status: "scheduled" | "active" | "finished" | "canceled";
}
export type CongressConferenceRecord = DBRecordItem<CongressConference>;
