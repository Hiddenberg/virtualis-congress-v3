interface ConferenceQnASession {
   organization: OrganizationRecord["id"];
   congress: CongressRecord["id"];
   conference: CongressConferenceRecord["id"];
   livestreamSession: LivestreamSessionRecord["id"];
}
type ConferenceQnASessionRecord = DBRecordItem<ConferenceQnASession>;
