interface CongressInPersonState {
   organization: OrganizationRecord["id"];
   congress: CongressRecord["id"];
   activeConference?: ConferenceRecord["id"];
   status: "active" | "standby" | "finished";
}
type CongressInPersonStateRecord = DBRecordItem<CongressInPersonState>;
