import type { CongressConferenceRecord } from "@/features/conferences/types/conferenceTypes";
import type { CongressRecord } from "@/features/congresses/types/congressTypes";
import type { OrganizationRecord } from "@/features/organizations/types/organizationTypes";

export interface CongressInPersonState {
   organization: OrganizationRecord["id"];
   congress: CongressRecord["id"];
   activeConference?: CongressConferenceRecord["id"] | null;
   // selectedConference?: ConferenceRecord["id"];
   status: "active" | "standby" | "finished";
}
export type CongressInPersonStateRecord = DBRecordItem<CongressInPersonState>;
